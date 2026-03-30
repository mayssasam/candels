import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
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
import { addCartItem, getCartCount, getCartItems, getCartItemsForUser, removeCartItem } from './utils/cart'
import './App.css'

function App() {
	const [sessionUser, setSessionUser] = useState(getSessionUser())
	const [cartItems, setCartItems] = useState(getCartItems())

	const cartCount = useMemo(() => getCartCount(cartItems), [cartItems])

	useEffect(() => {
		let mounted = true

		async function syncCart() {
			if (sessionUser?.id) {
				const remote = await getCartItemsForUser(sessionUser.id)
				if (mounted) {
					setCartItems(remote)
				}
				return
			}

			if (mounted) {
				setCartItems(getCartItems())
			}
		}

		syncCart()

		return () => {
			mounted = false
		}
	}, [sessionUser])

	const handleLoginSuccess = () => {
		setSessionUser(getSessionUser())
	}

	const handleLogout = () => {
		logoutUser()
		setSessionUser(null)
		setCartItems(getCartItems())
	}

	const handleAddToCart = async (product) => {
		const updated = await addCartItem(product, sessionUser?.id)
		setCartItems(updated)
	}

	const handleRemoveFromCart = async (productId) => {
		const updated = await removeCartItem(productId, sessionUser?.id)
		setCartItems(updated)
	}

	return (
		<div className="app-shell">
			<video className="video-bg" autoPlay muted loop playsInline>
				<source src="/pr/PixVerse_V5.6_Image_Text_360P_candels.mp4" type="video/mp4" />
			</video>
			<div className="video-overlay" />

			<div className="app-content">
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
			</div>
		</div>
	)
}

export default App

