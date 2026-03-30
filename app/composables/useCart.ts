// app/composables/useCart.ts
export const useCart = () => {
  // Each entry: { ...item, quantity: number }
  const cart = useState<any[]>('cart', () => [])

  const addToCart = (item: any) => {
    const existing = cart.value.find((i: any) => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ ...item, quantity: 1 })
    }
  }

  const increaseQty = (itemId: any) => {
    const item = cart.value.find((i: any) => i.id === itemId)
    if (item) item.quantity++
  }

  const decreaseQty = (itemId: any) => {
    const item = cart.value.find((i: any) => i.id === itemId)
    if (item) {
      item.quantity--
      if (item.quantity <= 0) {
        cart.value = cart.value.filter((i: any) => i.id !== itemId)
      }
    }
  }

  const removeItem = (itemId: any) => {
    cart.value = cart.value.filter((i: any) => i.id !== itemId)
  }

  const totalPrice = computed(() =>
    cart.value.reduce((total, item: any) => total + (Number(item.price) * item.quantity || 0), 0)
  )

  const cartCount = computed(() =>
    cart.value.reduce((total, item: any) => total + item.quantity, 0)
  )

  const clearCart = () => { cart.value = [] }

  return { cart, addToCart, increaseQty, decreaseQty, removeItem, totalPrice, cartCount, clearCart }
}
