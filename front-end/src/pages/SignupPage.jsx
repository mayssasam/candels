import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../utils/auth'

function SignupPage({ onSignupSuccess }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      setFeedback({ type: 'error', message: 'Please fill all required fields.' })
      return
    }

    if (formData.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    const result = registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.message })
      return
    }

    setFeedback({ type: 'success', message: result.message })
    loginUser({ email: formData.email, password: formData.password })
    if (onSignupSuccess) {
      onSignupSuccess()
    }
    setTimeout(() => navigate('/products'), 800)
  }

  return (
    <main className="page-body">
      <section className="section-wrap auth-wrap">
        <article className="auth-card">
          <p className="eyebrow">Create account</p>
          <h1>Sign Up</h1>
          <p className="auth-subtitle">Join sam's candels and start shopping your favorite fragrances.</p>

          <form className="auth-form" onSubmit={onSubmit}>
            <input name="name" type="text" placeholder="Full name" value={formData.name} onChange={onChange} />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={onChange} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={onChange} />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={onChange}
            />
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>

          {feedback.message ? (
            <p className={feedback.type === 'error' ? 'auth-feedback error' : 'auth-feedback success'}>
              {feedback.message}
            </p>
          ) : null}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </article>
      </section>
    </main>
  )
}

export default SignupPage
