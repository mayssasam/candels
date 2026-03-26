import { products } from '../data/products'
import { Link } from 'react-router-dom'

function ProductsPage() {
  return (
    <main className="page-body">
      <section className="products section-wrap">
        <div className="section-head">
          <p className="eyebrow">Our Best Sellers</p>
          <h2>Signature candle collection</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-link" to={`/products/${product.id}`} key={product.id}>
              <article className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{product.price}</strong>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ProductsPage
