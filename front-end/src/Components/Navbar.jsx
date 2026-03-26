import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar({ cartCount, sessionUser, onLogout }) {
  const navClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left">
          <NavLink to="/" className={navClass} end>Home</NavLink>
          <NavLink to="/products" className={navClass}>Products</NavLink>
          <NavLink to="/cart" className={navClass}>Cart ({cartCount})</NavLink>
        </div>

        <div className="nav-logo">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        <div className="nav-right">
          <NavLink to="/contact" className={navClass}>Contact</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          {sessionUser ? (
            <>
              <span className="user-pill">Hi, {sessionUser.name}</span>
              <button type="button" className="nav-link nav-button" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/signup" className={navClass}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar