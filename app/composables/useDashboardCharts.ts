import Chart from 'chart.js/auto'
import type { Ref } from 'vue'

export function useDashboardCharts(orders: Ref<any[]> | (() => any[])) {
  const periods = [
    { days: 7, label: 'آخر 7 أيام' },
    { days: 14, label: 'آخر 14 يوم' },
    { days: 30, label: 'آخر 30 يوم' },
  ]

  const selectedPeriod = ref(7)
  const metricType = ref<'orders' | 'revenue'>('orders')
  const trendCanvasRef = ref<HTMLCanvasElement | null>(null)

  let trendChartInstance: Chart | null = null

  const arabicDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  const getOrdersList = () => (typeof orders === 'function' ? orders() : orders.value) || []

  const getLocalDateKey = (isoStr: string) => {
    if (!isoStr) return ''
    const d = new Date(isoStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const filteredOrders = computed(() => {
    const list = getOrdersList()
    if (!list.length) return []
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - selectedPeriod.value)
    cutoff.setHours(0, 0, 0, 0)

    return list.filter((order: any) => {
      if (!order.created_at) return false
      return new Date(order.created_at) >= cutoff
    })
  })

  const daysData = computed(() => {
    const result: Array<{
      dateKey: string
      dayName: string
      shortDate: string
      ordersCount: number
      revenue: number
    }> = []
    const today = new Date()

    for (let i = selectedPeriod.value - 1; i >= 0; i--) {
      const target = new Date(today)
      target.setDate(today.getDate() - i)

      const y = target.getFullYear()
      const m = String(target.getMonth() + 1).padStart(2, '0')
      const d = String(target.getDate()).padStart(2, '0')
      const dateKey = `${y}-${m}-${d}`

      const dayName = arabicDayNames[target.getDay()] || ''
      const shortDate = `${target.getDate()}/${target.getMonth() + 1}`

      const dayOrders = filteredOrders.value.filter(
        (o: any) => getLocalDateKey(o.created_at) === dateKey
      )

      const ordersCount = dayOrders.length
      const revenue = dayOrders.reduce(
        (sum: number, o: any) => sum + (Number(o.total_price) || 0),
        0
      )

      result.push({ dateKey, dayName, shortDate, ordersCount, revenue })
    }

    return result
  })

  const peakDay = computed(() => {
    if (!daysData.value.length) return null
    const max = Math.max(...daysData.value.map((d) => d.ordersCount))
    if (max <= 0) return null
    return daysData.value.find((d) => d.ordersCount === max) || null
  })

  const avgDailyOrders = computed(() => {
    const total = filteredOrders.value.length
    if (!total) return '0'
    return (total / selectedPeriod.value).toFixed(1)
  })

  const topDishesList = computed(() => {
    const map = new Map<string, { name: string; count: number; totalRevenue: number }>()

    for (const order of filteredOrders.value) {
      let items = order.items
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items)
        } catch {
          items = []
        }
      }
      if (!Array.isArray(items)) continue

      for (const it of items) {
        const name = (it.name || 'صنف').trim()
        const qty = Number(it.quantity) || 1
        const price = Number(it.price || it.basePrice || 0) * qty

        if (!map.has(name)) {
          map.set(name, { name, count: 0, totalRevenue: 0 })
        }
        const current = map.get(name)!
        current.count += qty
        current.totalRevenue += price
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  const topDish = computed(() => (topDishesList.value.length ? topDishesList.value[0] : null))

  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const updateViewportFlag = () => {
    isMobile.value = Boolean(mediaQuery?.matches)
  }

  const renderTrendChart = () => {
    if (!trendCanvasRef.value) return

    if (trendChartInstance) {
      trendChartInstance.destroy()
      trendChartInstance = null
    }

    const canvas = trendCanvasRef.value
    const mobile = isMobile.value
    const labels = daysData.value.map((d) => [d.dayName, d.shortDate])
    const isOrders = metricType.value === 'orders'
    const dataValues = isOrders
      ? daysData.value.map((d) => d.ordersCount)
      : daysData.value.map((d) => d.revenue)

    const maxVal = Math.max(...dataValues, 0)
    const shouldRotateOrSkip = mobile ? selectedPeriod.value > 7 : selectedPeriod.value > 14

    const baseTooltip = {
      textDirection: 'rtl',
      backgroundColor: '#1F2937',
      titleFont: { family: 'Tajawal, sans-serif', size: 13, weight: 'bold' as const },
      bodyFont: { family: 'Tajawal, sans-serif', size: 12 },
      padding: 12,
      cornerRadius: 12,
    }

    const formatTooltipTitle = (items: any[]) => {
      const day = daysData.value[items[0]?.dataIndex]
      return day ? `${day.dayName} - ${day.shortDate}` : ''
    }

    const xScale = {
      grid: { display: false },
      ticks: {
        font: {
          family: 'Tajawal, sans-serif',
          size: mobile ? 9 : 11,
          weight: 'bold' as const,
        },
        color: '#6B7280',
        padding: mobile ? 4 : 6,
        maxRotation: shouldRotateOrSkip ? 45 : 0,
        minRotation: 0,
        autoSkip: shouldRotateOrSkip,
      },
    }

    try {
      if (isOrders) {
        trendChartInstance = new Chart(canvas, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'عدد الطلبات',
                data: dataValues,
                backgroundColor: daysData.value.map((d) =>
                  d.ordersCount === maxVal && maxVal > 0 ? '#EA580C' : '#FED7AA'
                ),
                hoverBackgroundColor: '#EA580C',
                borderRadius: 8,
                borderSkipped: false,
                maxBarThickness: selectedPeriod.value > 14 ? 18 : 36,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                ...baseTooltip,
                callbacks: {
                  title: formatTooltipTitle,
                  label: (ctx) => `عدد الطلبات: ${ctx.parsed.y} طلب`,
                  afterLabel: (ctx) => {
                    const day = daysData.value[ctx.dataIndex]
                    return day ? `المبيعات: ${day.revenue.toLocaleString()} ج.م` : ''
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  font: { family: 'Tajawal, sans-serif', size: 11 },
                  color: '#9CA3AF',
                },
                grid: { color: '#F3F4F6' },
              },
              x: xScale,
            },
          },
        })
      } else {
        const ctx = canvas.getContext('2d')
        const gradient = ctx ? ctx.createLinearGradient(0, 0, 0, 300) : null
        if (gradient) {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)')
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)')
        }

        trendChartInstance = new Chart(canvas, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'المبيعات (ج.م)',
                data: dataValues,
                borderColor: '#10B981',
                borderWidth: 3,
                backgroundColor: gradient || 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                ...baseTooltip,
                callbacks: {
                  title: formatTooltipTitle,
                  label: (ctx) => `المبيعات: ${(ctx.parsed.y ?? 0).toLocaleString()} ج.م`,
                  afterLabel: (ctx) => {
                    const day = daysData.value[ctx.dataIndex]
                    return day ? `عدد الطلبات: ${day.ordersCount} طلب` : ''
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: { family: 'Tajawal, sans-serif', size: 11 },
                  color: '#9CA3AF',
                  callback: (val) => `${Number(val).toLocaleString()} ج.م`,
                },
                grid: { color: '#F3F4F6' },
              },
              x: xScale,
            },
          },
        })
      }
    } catch (err) {
      console.error('Error creating trend chart:', err)
    }
  }

  const refreshAllCharts = () => {
    nextTick(() => renderTrendChart())
  }

  watch([daysData, metricType, isMobile], () => {
    nextTick(() => renderTrendChart())
  })

  watch(getOrdersList, () => refreshAllCharts(), { deep: true })

  onMounted(() => {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(max-width: 639px)')
      updateViewportFlag()
      mediaQuery.addEventListener('change', updateViewportFlag)
    }
    refreshAllCharts()
  })

  onBeforeUnmount(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', updateViewportFlag)
      mediaQuery = null
    }
    if (trendChartInstance) {
      trendChartInstance.destroy()
      trendChartInstance = null
    }
  })

  return {
    periods,
    selectedPeriod,
    metricType,
    trendCanvasRef,
    peakDay,
    avgDailyOrders,
    topDishesList,
    topDish,
  }
}
