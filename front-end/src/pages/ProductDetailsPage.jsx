import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL = '/api'

function formatPrice(price) {
  if (typeof price === 'number') return `${price} DT`
  return String(price).includes('DT') ? String(price) : `${price} DT`
}

function ProductDetailsPage({ sessionUser, onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load this product.')
        }

        const payload = await response.json()
        setProduct(payload.product || null)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return
        setProduct(null)
        setError(fetchError.message || 'Something went wrong while loading the product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()

    return () => abortController.abort()
  }, [id])

  const requireLogin = () => {
    if (sessionUser) return true
    navigate('/login', { state: { from: `/products/${id}` } })
    return false
  }

  const handleAddToCart = () => {
    if (!requireLogin()) return
    if (!product) return
    onAddToCart(product)
    setFeedback('Product added to cart.')
  }

  const handleShopNow = () => {
    if (!requireLogin()) return
    if (!product) return
    onAddToCart(product)
    navigate('/cart')
  }

  if (loading) {
    return (
      <main className="page-body">
        <section className="section-wrap product-details-card">
          <p className="eyebrow">Product details</p>
          <h2>Loading product...</h2>
        </section>
      </main>
    )
  }

  if (!product || error) {
    return (
      <main className="page-body">
        <section className="section-wrap product-details-card">
          <p className="eyebrow">Product not found</p>
          <h2>{error || 'This product does not exist.'}</h2>
          <Link to="/products" className="btn btn-primary">Back to products</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-body">
      <section className="section-wrap product-details-wrap">
        <img src={product.image} alt={product.name} className="product-details-image" />
        <article className="product-details-card">
          <p className="eyebrow">Product details</p>
          <h1>{product.name}</h1>
          <p className="product-details-description">{product.description}</p>
          <p className="product-details-price">{formatPrice(product.price)}</p>

          <ul className="product-details-list">
            <li><strong>Burn time:</strong> {product.details.burnTime}</li>
            <li><strong>Wax:</strong> {product.details.wax}</li>
            <li><strong>Size:</strong> {product.details.size}</li>
            <li><strong>Scent notes:</strong> {product.details.notes}</li>
          </ul>

          <div className="product-details-actions">
            <button type="button" className="btn btn-primary" onClick={handleShopNow}>Shop Now</button>
            <button type="button" className="btn btn-ghost" onClick={handleAddToCart}>Add to Cart</button>
          </div>

          {feedback ? <p className="auth-feedback success product-feedback">{feedback}</p> : null}
        </article>
      </section>
    </main>
  )
}

export default ProductDetailsPage
