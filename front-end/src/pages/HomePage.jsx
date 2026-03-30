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
        <div className="hero-card hero-video-card" aria-label="Candle video preview">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/pr/cand.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-caption">
            <h3>Candle Mood</h3>
            <p>Soft pink and warm light ambience.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
