const CART_KEY = 'candels_cart'

export function getCartItems() {
  const raw = localStorage.getItem(CART_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addCartItem(product) {
  const cart = getCartItems()
  const existing = cart.find((item) => item.id === product.id)

  if (existing) {
    const updated = cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    )
    saveCartItems(updated)
    return updated
  }

  const updated = [
    ...cart,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    },
  ]

  saveCartItems(updated)
  return updated
}

export function removeCartItem(productId) {
  const updated = getCartItems().filter((item) => item.id !== productId)
  saveCartItems(updated)
  return updated
}

export function clearCart() {
  saveCartItems([])
}

export function getCartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(items) {
  return items.reduce((sum, item) => {
    const numericPrice = Number(String(item.price).replace(/[^\d.]/g, ''))
    return sum + numericPrice * item.quantity
  }, 0)
}
