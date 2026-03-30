const CART_KEY = 'candels_cart'
const API_BASE_URL = 'http://localhost:4000/api'

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

export async function getCartItemsForUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`)
    if (!response.ok) {
      return []
    }

    const payload = await response.json()
    return (payload.items || []).map((item) => ({
      id: item.productId,
      name: item.name,
      price: `${item.price} DT`,
      image: item.image,
      quantity: item.quantity,
    }))
  } catch {
    return []
  }
}

export async function addCartItem(product, userId) {
  if (userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })

      if (!response.ok) {
        return getCartItems()
      }

      const payload = await response.json()
      return (payload.items || []).map((item) => ({
        id: item.productId,
        name: item.name,
        price: `${item.price} DT`,
        image: item.image,
        quantity: item.quantity,
      }))
    } catch {
      return getCartItems()
    }
  }

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

export async function removeCartItem(productId, userId) {
  if (userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        return getCartItems()
      }

      const payload = await response.json()
      return (payload.items || []).map((item) => ({
        id: item.productId,
        name: item.name,
        price: `${item.price} DT`,
        image: item.image,
        quantity: item.quantity,
      }))
    } catch {
      return getCartItems()
    }
  }

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
