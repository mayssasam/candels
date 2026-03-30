import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API_BASE_URL = '/api'

function formatPrice(price) {
  if (typeof price === 'number') return `${price} DT`
  return String(price).includes('DT') ? String(price) : `${price} DT`
}

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => {
    setPage(1)
  }, [searchTerm, sortBy])

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const query = new URLSearchParams({
          page: String(page),
          limit: '9',
        })

        if (searchTerm.trim()) {
          query.set('q', searchTerm.trim())
        }

        if (sortBy !== 'featured') {
          query.set('sort', sortBy)
        }

        const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load products at the moment.')
        }

        const payload = await response.json()
        setProducts(payload.products || [])
        setPagination(payload.pagination || { page: 1, totalPages: 1, total: 0 })
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return
        setProducts([])
        setPagination({ page: 1, totalPages: 1, total: 0 })
        setError(fetchError.message || 'Something went wrong while loading products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    return () => abortController.abort()
  }, [searchTerm, sortBy, page])

  const handleCardMove = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 10
    const rotateX = ((0.5 - (y / rect.height)) * 10)

    card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`)
    card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`)
  }

  const handleCardLeave = (event) => {
    const card = event.currentTarget
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  return (
    <main className="page-body">
      <section className="products section-wrap">
        <div className="section-head">
          <p className="eyebrow">Our Best Sellers</p>
          <h2>Signature candle collection</h2>
        </div>

        <div className="products-toolbar" role="region" aria-label="Product filters">
          <input
            type="search"
            className="products-search"
            placeholder="Search candle by name or vibe..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search products"
          />
          <select
            className="products-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {loading ? <p className="products-empty">Loading products...</p> : null}
        {error ? <p className="products-error">{error}</p> : null}

        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-link" to={`/products/${product.id}`} key={product.id}>
              <article
                className="product-card product-card-3d"
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
              >
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {!loading && !error && !products.length ? (
          <p className="products-empty">No products match your search. Try another keyword.</p>
        ) : null}

        {!loading && !error && pagination.totalPages > 1 ? (
          <div className="products-pagination" role="navigation" aria-label="Products pagination">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span className="pagination-text">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPage((previous) => Math.min(pagination.totalPages, previous + 1))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default ProductsPage
