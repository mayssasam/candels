import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="page-body">
      <section className="hero section-wrap">
        <div className="hero-text">
          <p className="eyebrow">Handcrafted Candle Studio</p>
          <h1>Light your home with calm, warm fragrances</h1>
          <p>
            Discover artisanal candles poured in small batches using natural wax,
            cotton wicks, and elegant scents inspired by cozy evenings.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Shop Collection</Link>
            <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
        <div className="hero-card" aria-label="Featured candle">
          <h3>Featured: Vanilla Amber</h3>
          <p>Soft vanilla, amber wood, and warm musk.</p>
          <span>Burn time: 50 hours</span>
        </div>
      </section>
    </main>
  )
}

export default HomePage
