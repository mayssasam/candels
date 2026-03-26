import { Link } from 'react-router-dom'
import { getCartTotal } from '../utils/cart'

function CartPage({ items, onRemoveItem }) {
  const total = getCartTotal(items)

  if (!items.length) {
    return (
      <main className="page-body">
        <section className="section-wrap cart-card">
          <p className="eyebrow">Your cart</p>
          <h2>Your cart is empty.</h2>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-body">
      <section className="section-wrap cart-layout">
        <article className="cart-card">
          <p className="eyebrow">Your cart</p>
          <h2>Shopping cart</h2>
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => onRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </article>

        <aside className="cart-card cart-summary">
          <p className="eyebrow">Order summary</p>
          <h3>Total: {total.toFixed(2)} DT</h3>
          <button type="button" className="btn btn-primary">Checkout</button>
        </aside>
      </section>
    </main>
  )
}

export default CartPage
