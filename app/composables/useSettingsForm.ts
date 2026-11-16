export function useSettingsForm() {
  const { ownerId } = useAuthUser()
  const { $toast } = useNuxtApp()
  const { t } = useI18n()

  const {
    profile,
    loading: profileLoading,
    uploading: logoUploading,
    fetchProfile,
    updateProfile,
    uploadLogo: uploadLogoAction,
  } = useSettings()

  const { deleteItemsByCategory, updateItemsCategory } = useMenu()
  const { maxCategories: planMaxCategories, isFree, isBasic, isPro, currentPlan, can } = usePlan()

  // Upgrade modal state
  const showUpgradeModal = ref(false)
  const upgradeModalConfig = ref({
    limitType: 'categories',
    title: '',
    badgeText: '',
    message: '',
  })

  const openUpgradeForCategories = () => {
    upgradeModalConfig.value = {
      limitType: 'categories',
      title: t('plans.modal_default_title'),
      badgeText: t('plans.reached_limit'),
      message: '',
    }
    showUpgradeModal.value = true
  }

  const openUpgradeForFeature = (featureName: string, badge = '', customMsg = '') => {
    upgradeModalConfig.value = {
      limitType: 'general',
      title: t('plans.feature_upgrade_title', { feature: featureName }),
      badgeText: badge || t('plans.pro_badge_short'),
      message: customMsg || t('plans.feature_upgrade_msg', { feature: featureName }),
    }
    showUpgradeModal.value = true
  }

  // Categories limits
  const maxCategories = computed(() => {
    if (profile.value?.max_categories !== undefined && profile.value?.max_categories !== null) {
      return profile.value.max_categories
    }
    return planMaxCategories.value
  })

  const isCategoryLimitReached = computed(() => {
    if (maxCategories.value === -1) return false
    return (form.value.categories?.length || 0) >= maxCategories.value
  })

  // Shifts logic
  const {
    shifts: restaurantShiftsList,
    fetchShifts: loadRestaurantShifts,
    addShift: createRestaurantShift,
    deleteShift: removeRestaurantShift,
  } = useShifts()

  const newShiftForm = ref({
    shift_name: '',
    start_time: '08:00',
    end_time: '16:00',
  })

  const handleAddNewShift = async () => {
    if (!ownerId.value) return
    if (!newShiftForm.value.shift_name.trim()) {
      return $toast.error(t('admin.error_fields'))
    }
    await createRestaurantShift(ownerId.value, {
      shift_name: newShiftForm.value.shift_name.trim(),
      start_time: newShiftForm.value.start_time,
      end_time: newShiftForm.value.end_time,
    })
    newShiftForm.value.shift_name = ''
  }

  const handleRemoveShift = async (shiftId: string | number) => {
    await removeRestaurantShift(shiftId)
  }

  watch(
    ownerId,
    (id) => {
      if (id) loadRestaurantShifts(id)
    },
    { immediate: true }
  )

  // Main settings form
  const originalSlug = ref('')
  const newCategory = ref('')
  const newDeliveryArea = ref<{ name: string; price: number | string }>({ name: '', price: '' })

  const form = ref({
    business_name: '',
    slug: '',
    whatsapp_number: '',
    categories: [] as string[],
    delivery_areas: [] as Array<{ name: string; price: number }>,
    logo: '',
    is_active: true,
    order_reset_type: 'shift',
    primary_color: '#ea580c',
    show_table_number: false,
    show_queue_number: false,
    whatsapp_ordering_enabled: true,
    show_phone_number: true,
    automated_hours_enabled: false,
    opening_time: '09:00',
    closing_time: '23:00',
    payment_methods_allowed: 'all',
    vodafone_cash_number: '',
    instapay_account: '',
    bio_hub_enabled: false,
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    social_location: '',
    social_phone: '',
    allow_order_editing: false,
    order_edit_window_minutes: 5,
    announcement_enabled: false,
    announcement_text: '',
    cashier_ordering_enabled: true,
  })

  // Initialize data
  watch(
    ownerId,
    async (newId) => {
      if (newId) {
        const data = await fetchProfile(newId)
        if (data) {
          originalSlug.value = data.slug || ''
          form.value = {
            business_name: data.business_name || '',
            slug: data.slug || '',
            whatsapp_number: data.whatsapp_number || '',
            categories: data.categories || [],
            delivery_areas: data.delivery_areas || [],
            logo: data.logo || '',
            is_active: data.is_active !== false,
            order_reset_type: ['shift', 'daily'].includes(data.order_reset_type) ? data.order_reset_type : 'shift',
            primary_color: data.primary_color || '#ea580c',
            show_table_number: data.show_table_number === true,
            show_queue_number: data.show_queue_number === true,
            whatsapp_ordering_enabled: data.whatsapp_ordering_enabled !== false,
            show_phone_number: data.show_phone_number !== false,
            automated_hours_enabled: data.automated_hours_enabled === true,
            opening_time: data.opening_time || '09:00',
            closing_time: data.closing_time || '23:00',
            payment_methods_allowed: data.payment_methods_allowed || 'all',
            vodafone_cash_number: data.vodafone_cash_number || '',
            instapay_account: data.instapay_account || '',
            bio_hub_enabled: data.bio_hub_enabled === true,
            social_instagram: data.social_instagram || '',
            social_facebook: data.social_facebook || '',
            social_tiktok: data.social_tiktok || '',
            social_location: data.social_location || '',
            social_phone: data.social_phone || '',
            allow_order_editing: data.allow_order_editing === true,
            order_edit_window_minutes: data.order_edit_window_minutes || 5,
            announcement_enabled: data.announcement_enabled === true,
            announcement_text: data.announcement_text || '',
            cashier_ordering_enabled: data.cashier_ordering_enabled !== false,
          }
        }
      }
    },
    { immediate: true }
  )

  // QR Code helpers
  const menuUrl = computed(() => {
    if (!form.value.slug) return 'https://getmenujet.com/menu'
    const cleanSlug = form.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
    return `https://getmenujet.com/menu/${cleanSlug}`
  })

  const qrUrl = computed(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(menuUrl.value)}`
  })

  const copyMenuUrl = () => {
    navigator.clipboard.writeText(menuUrl.value)
    $toast.success(t('admin.copy_success'))
  }

  const downloadQr = async () => {
    try {
      const response = await fetch(qrUrl.value)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qr-${form.value.slug || 'menu'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(qrUrl.value, '_blank')
    }
  }

  // Category actions
  const editingCategoryIndex = ref(-1)
  const editingCategoryName = ref('')
  const showDeleteCategoryModal = ref(false)
  const categoryToDeleteIndex = ref<number | null>(null)

  const addCategory = () => {
    const cat = newCategory.value.trim()
    if (!cat) return $toast.error(t('admin.error_fields'))
    if (form.value.categories.includes(cat)) return $toast.error(t('admin.category_exists'))

    if (isCategoryLimitReached.value) {
      $toast.error(t('plans.cats_limit_toast', { max: maxCategories.value }))
      openUpgradeForCategories()
      return
    }

    form.value.categories.push(cat)
    newCategory.value = ''
  }

  const startEditCategory = (index: number) => {
    editingCategoryIndex.value = index
    editingCategoryName.value = form.value.categories[index] || ''
  }

  const cancelEditCategory = () => {
    editingCategoryIndex.value = -1
    editingCategoryName.value = ''
  }

  const saveCategoryName = async (index: number) => {
    const oldName = form.value.categories[index]
    const newName = editingCategoryName.value.trim()

    if (!newName || newName === oldName) {
      cancelEditCategory()
      return
    }

    if (form.value.categories.some((c, i) => c === newName && i !== index)) {
      $toast.error(t('admin.category_exists'))
      cancelEditCategory()
      return
    }

    form.value.categories[index] = newName
    cancelEditCategory()

    if (ownerId.value && oldName) {
      await updateItemsCategory(oldName, newName, ownerId.value)
    }
  }

  const moveCategory = (index: number, direction: number) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= form.value.categories.length) return

    const cats = [...form.value.categories]
    const temp = cats[index]
    cats[index] = cats[newIndex]!
    cats[newIndex] = temp!
    form.value.categories = cats
  }

  const initiateRemoveCategory = (index: number) => {
    if (form.value.categories.length <= 1) {
      return $toast.error(t('admin.at_least_one_category'))
    }
    categoryToDeleteIndex.value = index
    showDeleteCategoryModal.value = true
  }

  const confirmRemoveCategory = async () => {
    if (categoryToDeleteIndex.value === null) return
    const index = categoryToDeleteIndex.value
    if (form.value.categories.length <= 1) {
      return $toast.error(t('admin.at_least_one_category'))
    }
    const catName = form.value.categories[index]
    form.value.categories.splice(index, 1)
    if (ownerId.value && catName) {
      await deleteItemsByCategory(catName, ownerId.value)
    }
    categoryToDeleteIndex.value = null
    showDeleteCategoryModal.value = false
  }

  // Delivery areas actions
  const addDeliveryArea = () => {
    if (!can('allow_branches')) {
      openUpgradeForFeature(t('plans.feat_delivery'), t('plans.pro_badge_short'), t('plans.delivery_modal_msg'))
      return
    }

    const name = newDeliveryArea.value.name.trim()
    const price = newDeliveryArea.value.price

    if (!name || price === '' || Number(price) < 0) {
      return $toast.error(t('admin.add_area_error'))
    }

    if (!form.value.delivery_areas) form.value.delivery_areas = []

    if (form.value.delivery_areas.some((a) => a.name === name)) {
      return $toast.error(t('admin.area_exists_error'))
    }

    form.value.delivery_areas.push({ name, price: Number(price) })
    newDeliveryArea.value = { name: '', price: '' }
  }

  const removeDeliveryArea = (index: number) => {
    form.value.delivery_areas.splice(index, 1)
  }

  // Logo upload
  const uploadLogo = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !ownerId.value) return

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      $toast.error(t('admin.logo_size_error'))
      target.value = ''
      return
    }

    const url = await uploadLogoAction(file, ownerId.value)
    if (url) form.value.logo = url
  }

  // Save settings
  const saveSettings = async () => {
    if (!ownerId.value) return

    const settingsData = {
      business_name: form.value.business_name,
      business_name_ar: form.value.business_name,
      slug: (originalSlug.value || form.value.slug || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-'),
      whatsapp_number: form.value.whatsapp_number,
      categories: [...form.value.categories],
      delivery_areas: form.value.delivery_areas ? [...form.value.delivery_areas] : [],
      logo: form.value.logo,
      is_active: form.value.is_active !== false,
      order_reset_type: form.value.order_reset_type || 'shift',
      primary_color: form.value.primary_color || '#ea580c',
      show_table_number: form.value.show_table_number === true,
      show_queue_number: form.value.show_queue_number === true,
      whatsapp_ordering_enabled: form.value.whatsapp_ordering_enabled !== false,
      show_phone_number: form.value.show_phone_number !== false,
      automated_hours_enabled: form.value.automated_hours_enabled === true,
      opening_time: form.value.opening_time,
      closing_time: form.value.closing_time,
      payment_methods_allowed: form.value.payment_methods_allowed || 'all',
      vodafone_cash_number: form.value.vodafone_cash_number ? form.value.vodafone_cash_number.trim() : '',
      instapay_account: form.value.instapay_account ? form.value.instapay_account.trim() : '',
      bio_hub_enabled: form.value.bio_hub_enabled === true,
      social_instagram: form.value.social_instagram ? form.value.social_instagram.trim() : '',
      social_facebook: form.value.social_facebook ? form.value.social_facebook.trim() : '',
      social_tiktok: form.value.social_tiktok ? form.value.social_tiktok.trim() : '',
      social_location: form.value.social_location ? form.value.social_location.trim() : '',
      social_phone: form.value.social_phone ? form.value.social_phone.trim() : '',
      allow_order_editing: form.value.allow_order_editing === true,
      order_edit_window_minutes: Number(form.value.order_edit_window_minutes) || 5,
      announcement_enabled: form.value.announcement_enabled === true,
      announcement_text: form.value.announcement_text ? form.value.announcement_text.trim() : '',
      cashier_ordering_enabled: form.value.cashier_ordering_enabled !== false,
    }

    const success = await updateProfile(ownerId.value, settingsData)
    if (success) {
      const authStore = useAuthStore()
      authStore.profile = { ...authStore.profile, ...settingsData }
    }
  }

  return {
    profile,
    profileLoading,
    actionLoading: profileLoading,
    logoUploading,
    isFree,
    isBasic,
    isPro,
    currentPlan,
    can,
    form,
    menuUrl,
    qrUrl,
    copyMenuUrl,
    downloadQr,
    uploadLogo,
    saveSettings,
    // Upgrade modal
    showUpgradeModal,
    upgradeModalConfig,
    openUpgradeForCategories,
    openUpgradeForFeature,
    // Categories
    maxCategories,
    isCategoryLimitReached,
    newCategory,
    editingCategoryIndex,
    editingCategoryName,
    showDeleteCategoryModal,
    addCategory,
    startEditCategory,
    cancelEditCategory,
    saveCategoryName,
    moveCategory,
    initiateRemoveCategory,
    confirmRemoveCategory,
    // Delivery areas
    newDeliveryArea,
    addDeliveryArea,
    removeDeliveryArea,
    // Shifts
    restaurantShiftsList,
    newShiftForm,
    handleAddNewShift,
    handleRemoveShift,
  }
}
