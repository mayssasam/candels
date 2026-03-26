import { Navigate, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from './Components/Navbar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CartPage from './pages/CartPage'
import { getSessionUser, logoutUser } from './utils/auth'
import { addCartItem, getCartCount, getCartItems, removeCartItem } from './utils/cart'
import './App.css'

function App() {
	const [sessionUser, setSessionUser] = useState(getSessionUser())
	const [cartItems, setCartItems] = useState(getCartItems())

	const cartCount = useMemo(() => getCartCount(cartItems), [cartItems])

	const handleLoginSuccess = () => {
		setSessionUser(getSessionUser())
	}

	const handleLogout = () => {
		logoutUser()
		setSessionUser(null)
	}

	const handleAddToCart = (product) => {
		const updated = addCartItem(product)
		setCartItems(updated)
	}

	const handleRemoveFromCart = (productId) => {
		const updated = removeCartItem(productId)
		setCartItems(updated)
	}

	return (
		<>
			<Navbar
				cartCount={cartCount}
				sessionUser={sessionUser}
				onLogout={handleLogout}
			/>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route
					path="/products/:id"
					element={
						<ProductDetailsPage
							sessionUser={sessionUser}
							onAddToCart={handleAddToCart}
						/>
					}
				/>
				<Route
					path="/cart"
					element={
						<CartPage
							items={cartItems}
							onRemoveItem={handleRemoveFromCart}
						/>
					}
				/>
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
				<Route path="/signup" element={<SignupPage onSignupSuccess={handleLoginSuccess} />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</>
	)
}

export default App

