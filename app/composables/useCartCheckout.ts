import instapayLogo from '~/assets/instapay-logo.png'
import vodafoneCashLogo from '~/assets/vodafone-cash-logo.png'

interface CheckoutProps {
  whatsappNumber: string
  restaurantUserId: string
  restaurantSlug: string
  deliveryAreas: Array<{ name: string; price: number }>
  tableNumberEnabled: boolean
  queueNumberEnabled: boolean
  phoneNumberEnabled: boolean
  paymentMethodsAllowed: string
  vodafoneCashNumber: string
  instapayAccount: string
}

export function useCartCheckout(props: CheckoutProps, onClose: () => void) {
  const { t, locale } = useI18n()
  const {
    cart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart,
    editingOrder,
    cancelEditingOrder,
  } = useCart()
  const { addOrder, updateHistoryOrder } = useOrderHistory()
  const { $toast } = useNuxtApp()
  const client = useSupabaseClient()
  const route = useRoute()

  const showCashierModal = ref(false)
  const showWhatsappCheckout = ref(false)
  const showCashierCheckout = ref(false)
  const isSubmitting = ref(false)
  const orderNumber = ref('')
  const cashierPhone = ref('')
  const tableNumber = ref('')
  const queueNumber = ref('')
  const selectedDeliveryArea = ref<{ name: string; price: number } | null>(null)

  const customerForm = ref({
    name: '',
    phone: '',
    method: 'استلام من المحل',
    addressDetail: '',
    paymentMethod: 'vodafone_cash',
  })

  const errors = ref<Record<string, string>>({
    name: '',
    phone: '',
    cashierPhone: '',
    tableNumber: '',
    queueNumber: '',
    deliveryArea: '',
    addressDetail: '',
  })

  const handleCloseCart = () => {
    cancelEditingOrder()
    onClose()
  }

  const availablePaymentMethods = computed(() => {
    if (props.paymentMethodsAllowed === 'none') return []
    const list: Array<{
      id: string
      name: string
      logo: string
      value: string
      label: string
      instruction: string
    }> = []

    if (['all', 'vodafone_cash'].includes(props.paymentMethodsAllowed)) {
      list.push({
        id: 'vodafone_cash',
        name: t('cart.vodafone_cash'),
        logo: vodafoneCashLogo,
        value: props.vodafoneCashNumber,
        label: t('admin.vodafone_cash_number_label'),
        instruction: t('cart.payment_instruction_vodafone'),
      })
    }

    if (['all', 'instapay'].includes(props.paymentMethodsAllowed)) {
      list.push({
        id: 'instapay',
        name: t('cart.instapay'),
        logo: instapayLogo,
        value: props.instapayAccount,
        label: t('admin.instapay_account_label'),
        instruction: t('cart.payment_instruction_instapay'),
      })
    }

    return list
  })

  const selectedPaymentMethodDetails = computed(() => {
    if (!availablePaymentMethods.value.length) return null
    return (
      availablePaymentMethods.value.find(
        (m) => m.id === customerForm.value.paymentMethod
      ) || availablePaymentMethods.value[0] || null
    )
  })

  watch(
    availablePaymentMethods,
    (methods) => {
      if (methods.length > 0) {
        if (!methods.some((m) => m.id === customerForm.value.paymentMethod)) {
          customerForm.value.paymentMethod = methods[0]!.id
        }
      } else {
        customerForm.value.paymentMethod = ''
      }
    },
    { immediate: true }
  )

  const validatePhone = (raw: string): string => {
    const val = raw.trim()
    if (!val) return t('cart.err_phone_required')
    if (!/^\d+$/.test(val)) return t('cart.err_phone_numbers')
    if (val.length < 8) return t('cart.err_phone_length')
    return ''
  }

  const resolveRestaurantAndSession = async () => {
    let restaurantId = props.restaurantUserId
    if (!restaurantId && route.params.slug) {
      const { data: profile } = await client
        .from('profiles')
        .select('user_id')
        .eq('slug', route.params.slug)
        .single()
      if (profile?.user_id) restaurantId = profile.user_id
    }

    let activeSessionId: string | null = null
    if (restaurantId) {
      try {
        const { data: openSession } = await client
          .from('cashier_sessions')
          .select('id')
          .eq('restaurant_id', restaurantId)
          .eq('status', 'open')
          .order('opened_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (openSession?.id) activeSessionId = openSession.id
      } catch (e) {
        console.warn('Could not query active session for order:', e)
      }
    }

    return { restaurantId, activeSessionId }
  }

  const calculateNextOrderNumber = async (restaurantId: string, currentSessionId: string | null) => {
    const { data: profile } = await client
      .from('profiles')
      .select('order_reset_type')
      .eq('user_id', restaurantId)
      .single()

    const resetType = profile?.order_reset_type || 'shift'

    if (resetType === 'shift') {
      if (currentSessionId) {
        const { data: lastOrders } = await client
          .from('orders')
          .select('order_number')
          .eq('user_id', restaurantId)
          .eq('session_id', currentSessionId)
          .order('order_number', { ascending: false })
          .limit(1)
        return (lastOrders?.[0]?.order_number || 0) + 1
      }
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const { data: lastOrders } = await client
        .from('orders')
        .select('order_number')
        .eq('user_id', restaurantId)
        .gt('created_at', todayStart.toISOString())
        .order('order_number', { ascending: false })
        .limit(1)
      return (lastOrders?.[0]?.order_number || 0) + 1
    }

    const now = new Date()
    let startDate = new Date(0)
    if (resetType === 'daily') {
      startDate = new Date(now.setHours(0, 0, 0, 0))
    } else if (resetType === 'weekly') {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      startDate = new Date(now.setDate(diff))
      startDate.setHours(0, 0, 0, 0)
    } else if (resetType === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    const { data: lastOrders } = await client
      .from('orders')
      .select('order_number')
      .eq('user_id', restaurantId)
      .gt('created_at', startDate.toISOString())
      .order('order_number', { ascending: false })
      .limit(1)

    return (lastOrders?.[0]?.order_number || 0) + 1
  }

  const openCashierCheckout = () => {
    if (cart.value.length === 0 || isSubmitting.value) return
    errors.value.cashierPhone = ''
    errors.value.tableNumber = ''
    errors.value.queueNumber = ''
    cashierPhone.value = ''
    tableNumber.value = ''
    queueNumber.value = ''

    if (!props.phoneNumberEnabled && !props.tableNumberEnabled && !props.queueNumberEnabled) {
      placeCashierOrder()
      return
    }

    showCashierCheckout.value = true
  }

  const placeCashierOrder = async () => {
    if (cart.value.length === 0 || isSubmitting.value) return

    errors.value.cashierPhone = ''
    errors.value.tableNumber = ''
    errors.value.queueNumber = ''
    let hasError = false

    if (props.phoneNumberEnabled) {
      const phoneErr = validatePhone(cashierPhone.value)
      if (phoneErr) {
        errors.value.cashierPhone = phoneErr
        hasError = true
      }
    }

    if (props.tableNumberEnabled && !tableNumber.value.trim()) {
      errors.value.tableNumber = t('cart.err_table_number_required')
      hasError = true
    }

    if (props.queueNumberEnabled && !queueNumber.value.trim()) {
      errors.value.queueNumber = t('cart.err_queue_number_required')
      hasError = true
    }

    if (hasError) return

    isSubmitting.value = true

    try {
      const { restaurantId: finalRestaurantId, activeSessionId } = await resolveRestaurantAndSession()
      if (!finalRestaurantId) {
        $toast?.error(t('cart.order_error'))
        return
      }

      if (editingOrder.value) {
        const orderNum = editingOrder.value.id
        orderNumber.value = orderNum

        const patchData: Record<string, any> = {
          items: cart.value,
          total_price: totalPrice.value,
        }
        if (cashierPhone.value.trim()) {
          patchData.customer_phone = cashierPhone.value.trim()
        }

        let updateQuery = client.from('orders').update(patchData)
        if (editingOrder.value.dbId) {
          updateQuery = updateQuery.eq('id', editingOrder.value.dbId)
        } else {
          const parsedNum = parseInt(editingOrder.value.id, 10)
          updateQuery = updateQuery
            .eq('user_id', finalRestaurantId)
            .eq('order_number', isNaN(parsedNum) ? editingOrder.value.id : parsedNum)
        }

        const { error: updateError } = await updateQuery
        if (updateError) {
          $toast?.error(t('admin.order_updated_failed') || 'Failed to update order')
          throw updateError
        }

        updateHistoryOrder(editingOrder.value.id, {
          items: [...cart.value],
          total: totalPrice.value,
        })

        showCashierCheckout.value = false
        showCashierModal.value = true
        $toast?.success(t('history.edit_success') || 'Order updated')

        setTimeout(() => {
          clearCart()
          cancelEditingOrder()
          onClose()
        }, 300)
        return
      }

      const nextOrderNum = await calculateNextOrderNumber(finalRestaurantId, activeSessionId)

      const { data: order, error: orderError } = await client
        .from('orders')
        .insert({
          user_id: finalRestaurantId,
          session_id: activeSessionId,
          items: cart.value,
          total_price: totalPrice.value,
          status: 'pending',
          payment_method: 'cash',
          customer_phone: cashierPhone.value.trim(),
          order_number: nextOrderNum,
          table_number: props.tableNumberEnabled ? tableNumber.value.trim() || null : null,
          queue_number: props.queueNumberEnabled ? queueNumber.value.trim() || null : null,
        })
        .select('id, order_number')
        .single()

      if (orderError) throw orderError

      const orderNum = formatOrderNumber(order.order_number || order.id)
      orderNumber.value = orderNum

      addOrder({
        id: orderNum,
        dbId: order.id,
        restaurantId: finalRestaurantId || props.restaurantUserId || '',
        restaurantSlug: props.restaurantSlug || String(route.params.slug || ''),
        items: [...cart.value],
        total: totalPrice.value,
        type: 'cashier',
        status: 'pending',
        time: new Date().toISOString(),
        customer: { phone: cashierPhone.value.trim() },
      })

      showCashierCheckout.value = false
      showCashierModal.value = true

      setTimeout(() => {
        clearCart()
        onClose()
        $toast?.success(t('cart.order_success'))
      }, 300)
    } catch (err) {
      console.error('Detailed Order Error:', err)
      $toast?.error(t('cart.order_error'))
    } finally {
      isSubmitting.value = false
    }
  }

  const openWhatsappCheckout = () => {
    errors.value = { ...errors.value, name: '', phone: '', deliveryArea: '', addressDetail: '' }
    showWhatsappCheckout.value = true
  }

  const whatsappLink = computed(() => {
    const RTL = '\u200F'
    const items = cart.value
      .map((i: any) => {
        const sizeLabel = i.size ? ` (${i.size.replace(/\s*قطعة/g, '').trim()})` : ''
        const qty = Number(i.quantity) || 1
        const lineTotal = Number(i.price) * qty
        const unitNote = qty > 1 ? ` (الواحدة ${i.basePrice || i.price} ${t('currency')})` : ''
        let text = `${RTL}▪ *${i.name}*${sizeLabel}\n${RTL}   الكمية: *${qty}*${unitNote} — *${lineTotal} ${t('currency')}*`
        if (i.selectedExtras?.length) {
          const extrasText = i.selectedExtras
            .map((e: any) => `${e.name} (+${e.price} ${t('currency')})`)
            .join('، ')
          text += `\n${RTL}   ➕ ${t('cart.whatsapp_extras_prefix')}: ${extrasText}`
        }
        if (i.notes) text += `\n${RTL}   ✏️ ملاحظات: ${i.notes}`
        return text
      })
      .join('\n\n')

    let header = editingOrder.value
      ? `*✏️ تعديل طلب رقم #${editingOrder.value.id}*`
      : t('cart.whatsapp_msg_header')
    if (!header || header === 'cart.whatsapp_msg_header') {
      header = 'طلب جديد'
    }
    const formattedHeader = header.startsWith('*') ? header : `*✨ ${header}*`

    const phoneLine = props.phoneNumberEnabled ? `${RTL}📞 الهاتف: ${customerForm.value.phone || 'غير محدد'}\n` : ''
    let msgText = `${RTL}${formattedHeader}\n\n${RTL}👤 الاسم: ${customerForm.value.name || 'غير محدد'}\n${phoneLine}\n${RTL}ℹ️ *تفاصيل الطلب:*\n${items}\n`

    const baseTotal = totalPrice.value
    const finalTotalText = `${baseTotal} ${t('admin.currency')}`

    if (customerForm.value.method === 'توصيل' && selectedDeliveryArea.value) {
      msgText += `\n${RTL}📦 الاستلام: توصيل (${selectedDeliveryArea.value.name})\n${RTL}📍 العنوان: ${customerForm.value.addressDetail || 'غير محدد'}\n\n${RTL}💰 ${t('cart.whatsapp_subtotal')}: ${baseTotal} ${t('admin.currency')}\n${RTL}💵 ${t('cart.whatsapp_delivery_cost')}: ${selectedDeliveryArea.value.price} ${t('admin.currency')}\n${RTL}💰 ${t('cart.whatsapp_final_total')}: *${baseTotal + Number(selectedDeliveryArea.value.price)} ${t('admin.currency')}*`
    } else {
      msgText += `\n${RTL}📦 الاستلام: ${customerForm.value.method}\n\n${RTL}💰 الإجمالي: *${finalTotalText}*`
    }

    if (selectedPaymentMethodDetails.value) {
      msgText += `\n${RTL}💳 طريقة الدفع: *${selectedPaymentMethodDetails.value.name}* (مرفق إشعار التحويل)`
    }

    return buildWhatsAppUrl(props.whatsappNumber, msgText)
  })

  const handleWhatsappOrderFinal = async () => {
    errors.value = { ...errors.value, name: '', phone: '', deliveryArea: '', addressDetail: '' }
    let hasError = false

    const nameValue = customerForm.value.name.trim()
    if (!nameValue) {
      errors.value.name = t('cart.err_name_required')
      hasError = true
    } else if (nameValue.length < 4) {
      errors.value.name = t('cart.err_name_length')
      hasError = true
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(nameValue)) {
      errors.value.name = t('cart.err_name_letters')
      hasError = true
    }

    if (props.phoneNumberEnabled) {
      const phoneErr = validatePhone(customerForm.value.phone)
      if (phoneErr) {
        errors.value.phone = phoneErr
        hasError = true
      }
    }

    if (customerForm.value.method === 'توصيل') {
      if (props.deliveryAreas?.length > 0 && !selectedDeliveryArea.value) {
        errors.value.deliveryArea = t('cart.err_delivery_required')
        hasError = true
      }
      if (!customerForm.value.addressDetail.trim()) {
        errors.value.addressDetail = t('cart.err_address_required')
        hasError = true
      }
    }

    if (hasError) return

    isSubmitting.value = true
    let nextOrderNum: number | string | null = null
    let insertedId: any = null
    let resolvedRestaurantId = props.restaurantUserId

    try {
      const { restaurantId, activeSessionId } = await resolveRestaurantAndSession()
      resolvedRestaurantId = restaurantId
      nextOrderNum = await calculateNextOrderNumber(restaurantId, activeSessionId)

      const isDelivery = customerForm.value.method === 'توصيل'
      const finalTotal =
        isDelivery && selectedDeliveryArea.value
          ? totalPrice.value + Number(selectedDeliveryArea.value.price)
          : totalPrice.value

      if (editingOrder.value) {
        nextOrderNum = editingOrder.value.id
        const orderData: Record<string, any> = {
          items: cart.value,
          total_price: finalTotal,
        }
        if (customerForm.value.phone) orderData.customer_phone = customerForm.value.phone.trim()
        if (customerForm.value.name) orderData.customer_name = customerForm.value.name.trim()
        if (customerForm.value.addressDetail) orderData.delivery_address = customerForm.value.addressDetail.trim()

        let updateQuery = client.from('orders').update(orderData)
        if (editingOrder.value.dbId) {
          updateQuery = updateQuery.eq('id', editingOrder.value.dbId)
        } else {
          const parsedNum = parseInt(editingOrder.value.id, 10)
          updateQuery = updateQuery
            .eq('user_id', restaurantId)
            .eq('order_number', isNaN(parsedNum) ? editingOrder.value.id : parsedNum)
        }
        await updateQuery

        updateHistoryOrder(editingOrder.value.id, {
          items: [...cart.value],
          total: finalTotal,
        })
      } else {
        const paymentSuffix = customerForm.value.paymentMethod ? `_${customerForm.value.paymentMethod}` : ''
        const orderPaymentMethod = `${isDelivery ? 'whatsapp_delivery' : 'whatsapp_pickup'}${paymentSuffix}`

        const orderData: Record<string, any> = {
          user_id: restaurantId,
          items: cart.value,
          total_price: finalTotal,
          status: 'pending',
        }
        if (activeSessionId) orderData.session_id = activeSessionId
        if (nextOrderNum) orderData.order_number = nextOrderNum
        if (customerForm.value.phone) orderData.customer_phone = customerForm.value.phone.trim()
        if (customerForm.value.name) orderData.customer_name = customerForm.value.name.trim()
        if (customerForm.value.addressDetail) orderData.delivery_address = customerForm.value.addressDetail.trim()
        if (orderPaymentMethod) orderData.payment_method = orderPaymentMethod

        const { data: insertedOrder, error: insertError } = await client
          .from('orders')
          .insert(orderData)
          .select('id')
          .maybeSingle()

        if (insertedOrder?.id) insertedId = insertedOrder.id

        if (insertError) {
          const { data: fallbackOrder } = await client
            .from('orders')
            .insert({
              user_id: restaurantId,
              items: cart.value,
              total_price: finalTotal,
              status: 'pending',
            })
            .select('id')
            .maybeSingle()
          if (fallbackOrder?.id) insertedId = fallbackOrder.id
        }
      }
    } catch (err) {
      console.error('Supabase Order Insert Error:', err)
    } finally {
      isSubmitting.value = false
    }

    const link = whatsappLink.value
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      window.location.href = link
    } else {
      window.open(link, '_blank')
    }

    if (!editingOrder.value) {
      const displayOrderNum = nextOrderNum
        ? formatOrderNumber(nextOrderNum)
        : 'WA-' + Date.now().toString().slice(-4)

      addOrder({
        id: displayOrderNum,
        dbId: insertedId,
        restaurantId: resolvedRestaurantId || props.restaurantUserId || '',
        restaurantSlug: props.restaurantSlug || String(route.params.slug || ''),
        items: [...cart.value],
        total: totalPrice.value,
        type: 'whatsapp',
        status: 'pending',
        time: new Date().toISOString(),
        customer: { ...customerForm.value },
      })
    }

    setTimeout(() => {
      clearCart()
      cancelEditingOrder()
      showWhatsappCheckout.value = false
      onClose()
    }, 300)
  }

  const closeCashierModal = () => {
    showCashierModal.value = false
    orderNumber.value = ''
  }

  return {
    locale,
    cart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart,
    editingOrder,
    cancelEditingOrder,
    handleCloseCart,
    showCashierModal,
    showWhatsappCheckout,
    showCashierCheckout,
    isSubmitting,
    orderNumber,
    cashierPhone,
    tableNumber,
    queueNumber,
    selectedDeliveryArea,
    customerForm,
    availablePaymentMethods,
    selectedPaymentMethodDetails,
    errors,
    openCashierCheckout,
    placeCashierOrder,
    openWhatsappCheckout,
    handleWhatsappOrderFinal,
    closeCashierModal,
  }
}
