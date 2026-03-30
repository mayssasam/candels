import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../utils/auth'

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const redirectPath = location.state?.from || '/products'

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setFeedback({ type: 'error', message: 'Please enter your email and password.' })
      return
    }

    const result = await loginUser({ email: formData.email, password: formData.password })

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.message })
      return
    }

    setFeedback({ type: 'success', message: result.message })
    if (onLoginSuccess) {
      onLoginSuccess()
    }
    setTimeout(() => navigate(redirectPath), 700)
  }

  return (
    <main className="page-body">
      <section className="section-wrap auth-wrap">
        <article className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Login</h1>
          <p className="auth-subtitle">Access your account to continue shopping.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={onChange} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={onChange} />
            <button type="submit" className="btn btn-primary">Login</button>
          </form>

          {feedback.message ? (
            <p className={feedback.type === 'error' ? 'auth-feedback error' : 'auth-feedback success'}>
              {feedback.message}
            </p>
          ) : null}

          <p className="auth-switch">
            No account yet? <Link to="/signup">Sign Up</Link>
          </p>
        </article>
      </section>
    </main>
  )
}

export default LoginPage
