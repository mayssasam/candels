function ContactPage() {
  return (
    <main className="page-body">
      <section className="contact section-wrap">
        <div className="section-head">
          <p className="eyebrow">Get in touch</p>
          <h2>Need help choosing a fragrance?</h2>
        </div>
        <form className="contact-form">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Your email" />
          <textarea rows="4" placeholder="Your message" />
          <button type="button" className="btn btn-primary">Send message</button>
        </form>
      </section>
    </main>
  )
}

export default ContactPage
