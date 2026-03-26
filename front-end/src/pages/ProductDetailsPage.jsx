import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { products } from '../data/products'

function ProductDetailsPage({ sessionUser, onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState('')
  const product = products.find((item) => String(item.id) === id)

  const requireLogin = () => {
    if (sessionUser) return true
    navigate('/login', { state: { from: `/products/${id}` } })
    return false
  }

  const handleAddToCart = () => {
    if (!requireLogin()) return
    onAddToCart(product)
    setFeedback('Product added to cart.')
  }

  const handleShopNow = () => {
    if (!requireLogin()) return
    onAddToCart(product)
    navigate('/cart')
  }

  if (!product) {
    return (
      <main className="page-body">
        <section className="section-wrap product-details-card">
          <p className="eyebrow">Product not found</p>
          <h2>This product does not exist.</h2>
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
          <p className="product-details-price">{product.price}</p>

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
