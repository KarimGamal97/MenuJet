export function useAdminMenuPage() {
  const { userId, ownerId, userRole } = useAuthUser()
  const { t } = useI18n()
  const { $toast } = useNuxtApp()

  const {
    items,
    pending: itemsPending,
    loading: actionLoading,
    uploading: imageUploading,
    fetchMenuItems,
    addItemToMenu,
    updateMenuItem,
    deleteMenuItem,
    uploadMenuImage,
  } = useMenu()

  const { profile, loading: profileLoading, fetchProfile } = useSettings()
  const { maxItems: planMaxItems, isFree: isPlanFree, can } = usePlan()

  // Upgrade modal state
  const showUpgradeModal = ref(false)
  const upgradeModalConfig = ref({
    limitType: 'items',
    title: '',
    badgeText: '',
    message: '',
  })

  const openUpgradeForExtras = () => {
    upgradeModalConfig.value = {
      limitType: 'general',
      title: t('plans.extras_modal_title'),
      badgeText: t('plans.basic_badge_short'),
      message: t('plans.extras_modal_msg'),
    }
    showUpgradeModal.value = true
  }

  const maxItems = computed(() => {
    if (profile.value?.max_items !== undefined && profile.value?.max_items !== null) {
      return profile.value.max_items
    }
    return planMaxItems.value
  })

  const isItemLimitReached = computed(() => {
    if (maxItems.value === -1) return false
    return (items.value?.length || 0) >= maxItems.value
  })

  // Modal & form state
  const isModalOpen = ref(false)
  const showDeleteModal = ref(false)
  const itemToDelete = ref<string | number | null>(null)
  const editingId = ref<string | number | null>(null)
  const imageUrl = ref('')

  const createDefaultItem = (category = '') => ({
    name: '',
    pricingType: 'size',
    prices: { sm: '', md: '', lg: '', single: '', double: '', triple: '' } as Record<string, string>,
    activeSize: 'sm',
    activePatty: 'single',
    weightOptions: [
      { label: '1/8 كيلو', price: '' },
      { label: '1/4 كيلو', price: '' },
      { label: 'كيلو', price: '' },
    ],
    countOptions: [
      { label: '', price: '' },
      { label: '', price: '' },
      { label: '', price: '' },
    ],
    fixedPrice: '',
    category,
    badge: '',
    available: true,
    description: '',
    extras: [] as Array<{ name: string; price: string | number }>,
  })

  const newItem = ref(createDefaultItem())

  // Search & category filter
  const searchQuery = ref('')
  const selectedCategory = ref('')

  const availableCategories = computed(() => {
    if (profileLoading.value || !profile.value) return []
    return profile.value.categories?.length
      ? profile.value.categories
      : ['Main', 'Drinks', 'Dessert']
  })

  const dynamicCategories = computed(() => availableCategories.value)

  // Category horizontal scroll
  const categoriesContainer = ref<HTMLElement | null>(null)
  const canScrollLeft = ref(false)
  const canScrollRight = ref(false)
  const hasScrollOverflow = ref(false)

  const checkCategoryScroll = () => {
    const el = categoriesContainer.value
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 5) {
      hasScrollOverflow.value = false
      canScrollLeft.value = false
      canScrollRight.value = false
      return
    }
    hasScrollOverflow.value = true
    const current = Math.abs(el.scrollLeft)
    canScrollLeft.value = current < maxScroll - 8
    canScrollRight.value = current > 8
  }

  const scrollCategories = (direction: 'left' | 'right') => {
    const el = categoriesContainer.value
    if (!el) return
    const amount = direction === 'left' ? -220 : 220
    el.scrollBy({ left: amount, behavior: 'smooth' })
    setTimeout(checkCategoryScroll, 350)
  }

  const selectCategory = (cat: string, event?: MouseEvent) => {
    selectedCategory.value = cat
    if (event?.currentTarget instanceof HTMLElement) {
      event.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
    setTimeout(checkCategoryScroll, 350)
  }

  onMounted(() => {
    nextTick(() => checkCategoryScroll())
    window.addEventListener('resize', checkCategoryScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkCategoryScroll)
  })

  watch(
    () => dynamicCategories.value,
    () => {
      nextTick(() => setTimeout(checkCategoryScroll, 150))
    },
    { deep: true, immediate: true }
  )

  const detectPricingType = (prices: Record<string, any> | null | undefined) => {
    if (!prices || typeof prices !== 'object') return 'fixed'
    const keys = Object.keys(prices).map((k) => k.toLowerCase())
    if (keys.some((k) => ['single', 'double', 'triple'].includes(k))) return 'patty'
    if (keys.some((k) => ['sm', 'md', 'lg', 's'].includes(k))) return 'size'
    if (keys.includes('fixed')) return 'fixed'
    if (keys.some((k) => /كيلو|جرام|كجم|kg|gram|وزن|ربع|نصف|ثمن|نص/i.test(k))) return 'weight'
    if (keys.length > 0) return 'count'
    return 'fixed'
  }

  watch(
    ownerId,
    (newVal) => {
      if (newVal) {
        fetchMenuItems(newVal)
        fetchProfile(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => availableCategories.value,
    (newCategories) => {
      if (newCategories && newCategories.length > 0) {
        if (!selectedCategory.value || !newCategories.includes(selectedCategory.value)) {
          selectedCategory.value = newCategories[0]!
        }
        if (!newItem.value.category || !newCategories.includes(newItem.value.category)) {
          newItem.value.category = newCategories[0]!
        }
      } else {
        selectedCategory.value = ''
        newItem.value.category = ''
      }
    },
    { immediate: true }
  )

  const filteredItems = computed(() => {
    if (!items.value) return []
    return items.value.filter((item: any) => {
      const matchesSearch = item.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory =
        !selectedCategory.value ||
        selectedCategory.value === 'الكل' ||
        item.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
  })

  const navigateToMenu = () => {
    if (profile.value?.slug) {
      window.open(`/menu/${profile.value.slug}`, '_blank')
    }
  }

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file || !userId.value) return

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!file.type || !validMimeTypes.includes(file.type.toLowerCase())) {
      $toast.error('صيغة الملف غير مدعومة! يرجى اختيار صورة بصيغة (JPG, PNG, WEBP)')
      target.value = ''
      return
    }

    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
      $toast.error(`حجم الصورة (${sizeInMB} ميجا) كبير! الحد الأقصى المسموح هو 2 ميجابايت لضمان سرعة تحميل المنيو للزبائن.`)
      target.value = ''
      return
    }

    const url = await uploadMenuImage(file, userId.value)
    if (url) imageUrl.value = url
  }

  const openAddModal = () => {
    if (isItemLimitReached.value) {
      $toast.error(t('plans.items_limit_toast', { max: maxItems.value }))
      showUpgradeModal.value = true
      return
    }

    editingId.value = null
    const defaultCat =
      selectedCategory.value && selectedCategory.value !== 'الكل'
        ? selectedCategory.value
        : availableCategories.value[0] || ''
    newItem.value = createDefaultItem(defaultCat)
    imageUrl.value = ''
    isModalOpen.value = true
  }

  const addExtraField = () => {
    if (!can('allow_extras')) {
      openUpgradeForExtras()
      return
    }
    if (!newItem.value.extras) newItem.value.extras = []
    newItem.value.extras.push({ name: '', price: '' })
  }

  const openEditModal = (item: any) => {
    editingId.value = item.id

    const normPrices: Record<string, any> = {}
    if (item.prices && typeof item.prices === 'object') {
      Object.entries(item.prices).forEach(([k, v]) => {
        normPrices[k.toLowerCase()] = v
      })
    }

    const type = detectPricingType(item.prices)

    const weightOptions: Array<{ label: string; price: string }> = []
    if (type === 'weight' && item.prices) {
      Object.entries(item.prices)
        .map(([label, price]) => ({ label, price: String(price) }))
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        .forEach((opt) => weightOptions.push(opt))
    }
    if (weightOptions.length === 0) {
      weightOptions.push(
        { label: '1/8 كيلو', price: '' },
        { label: '1/4 كيلو', price: '' },
        { label: 'كيلو', price: '' }
      )
    }

    const countOptions = [
      { label: '', price: '' },
      { label: '', price: '' },
      { label: '', price: '' },
    ]
    if (type === 'count' && item.prices) {
      Object.entries(item.prices).forEach(([label, price], i) => {
        if (i < 3) countOptions[i] = { label, price: String(price) }
      })
    }

    newItem.value = {
      name: item.name,
      pricingType: type,
      prices: {
        sm: String(normPrices.sm || normPrices.s || ''),
        md: String(normPrices.md || ''),
        lg: String(normPrices.lg || ''),
        single: String(normPrices.single || ''),
        double: String(normPrices.double || ''),
        triple: String(normPrices.triple || ''),
      },
      activeSize: 'sm',
      activePatty: 'single',
      weightOptions,
      countOptions,
      fixedPrice: type === 'fixed' ? String(item.prices?.fixed || item.price || '') : '',
      category: item.category,
      badge: item.badge || '',
      available: item.available !== false,
      description: item.description || '',
      extras: Array.isArray(item.extras) ? JSON.parse(JSON.stringify(item.extras)) : [],
    }

    imageUrl.value = item.image || ''
    isModalOpen.value = true
  }

  const buildCleanPrices = () => {
    const { pricingType, prices, weightOptions, countOptions, fixedPrice } = newItem.value
    const cleanPrices: Record<string, number> = {}

    if (pricingType === 'size') {
      for (const s of ['sm', 'md', 'lg']) {
        if (prices[s]) cleanPrices[s] = Number(prices[s])
      }
    } else if (pricingType === 'patty') {
      for (const p of ['single', 'double', 'triple']) {
        if (prices[p]) cleanPrices[p] = Number(prices[p])
      }
    } else if (pricingType === 'weight' || pricingType === 'count') {
      const source = pricingType === 'weight' ? weightOptions : countOptions
      const sorted = [...source].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
      for (const opt of sorted) {
        if (opt.label && opt.price) cleanPrices[opt.label] = Number(opt.price)
      }
    } else if (fixedPrice) {
      cleanPrices.fixed = Number(fixedPrice)
    }

    const values = Object.values(cleanPrices)
    return {
      cleanPrices,
      hasPrices: values.length > 0,
      displayPrice: values.length > 0 ? Math.min(...values) : 0,
    }
  }

  const handleSaveItem = async () => {
    if (!userId.value) return

    const { name, category } = newItem.value
    const { cleanPrices, hasPrices, displayPrice } = buildCleanPrices()

    if (!name || !hasPrices || !category) {
      return $toast.error(t('admin.error_fields'))
    }

    const itemData = {
      name,
      category,
      badge: newItem.value.badge || null,
      available: newItem.value.available,
      description: newItem.value.description,
      image: imageUrl.value || null,
      prices: cleanPrices,
      price: displayPrice,
      extras: newItem.value.extras?.filter((e) => e.name && e.price !== '') || [],
    }

    const result = editingId.value
      ? await updateMenuItem(editingId.value, itemData)
      : await addItemToMenu(itemData, ownerId.value)

    if (result) {
      isModalOpen.value = false
    }
  }

  const initiateDelete = (id: string | number) => {
    itemToDelete.value = id
    showDeleteModal.value = true
  }

  const confirmDelete = async () => {
    if (!itemToDelete.value) return
    const success = await deleteMenuItem(itemToDelete.value)
    if (success) {
      showDeleteModal.value = false
      itemToDelete.value = null
    }
  }

  return {
    userRole,
    items,
    itemsPending,
    actionLoading,
    imageUploading,
    profile,
    profileLoading,
    isPlanFree,
    can,
    showUpgradeModal,
    upgradeModalConfig,
    openUpgradeForExtras,
    maxItems,
    isItemLimitReached,
    isModalOpen,
    showDeleteModal,
    editingId,
    imageUrl,
    newItem,
    searchQuery,
    selectedCategory,
    availableCategories,
    dynamicCategories,
    categoriesContainer,
    canScrollLeft,
    canScrollRight,
    hasScrollOverflow,
    scrollCategories,
    checkCategoryScroll,
    selectCategory,
    filteredItems,
    navigateToMenu,
    handleFileUpload,
    openAddModal,
    addExtraField,
    openEditModal,
    handleSaveItem,
    initiateDelete,
    confirmDelete,
  }
}
