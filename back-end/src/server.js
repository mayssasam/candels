const express = require('express')
const cors = require('cors')
const { readDb, writeDb } = require('./db')

const app = express()
const PORT = process.env.PORT || 4000

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

app.use(cors({ origin: ['http://localhost:5173'] }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: "sam's-candels-api" })
})

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ ok: false, message: 'name, email and password are required.' })
  }

  if (String(password).length < 6) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
  }

  const db = readDb()
  const normalizedEmail = String(email).trim().toLowerCase()
  const exists = db.users.some((user) => user.email.toLowerCase() === normalizedEmail)

  if (exists) {
    return res.status(409).json({ ok: false, message: 'This email is already registered.' })
  }

  const newUser = {
    id: Date.now(),
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
  }

  db.users.push(newUser)
  writeDb(db)

  return res.status(201).json({
    ok: true,
    message: 'Account created successfully.',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'email and password are required.' })
  }

  const db = readDb()
  const normalizedEmail = String(email).trim().toLowerCase()

  const user = db.users.find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === String(password),
  )

  if (!user) {
    return res.status(401).json({ ok: false, message: 'Invalid email or password.' })
  }

  return res.json({
    ok: true,
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})

app.get('/api/products', (req, res) => {
  const db = readDb()
  const query = String(req.query.q || '').trim().toLowerCase()
  const minPrice = Number(req.query.minPrice)
  const maxPrice = Number(req.query.maxPrice)
  const sort = String(req.query.sort || 'default')
  const page = toPositiveInteger(req.query.page, 1)
  const limit = toPositiveInteger(req.query.limit, db.products.length || 1)

  let products = [...db.products]

  if (query) {
    products = products.filter((product) => {
      const notes = String(product?.details?.notes || '')
      return (
        String(product.name).toLowerCase().includes(query)
        || String(product.description).toLowerCase().includes(query)
        || notes.toLowerCase().includes(query)
      )
    })
  }

  if (!Number.isNaN(minPrice)) {
    products = products.filter((product) => Number(product.price) >= minPrice)
  }

  if (!Number.isNaN(maxPrice)) {
    products = products.filter((product) => Number(product.price) <= maxPrice)
  }

  if (sort === 'price-asc') {
    products.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sort === 'price-desc') {
    products.sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sort === 'newest') {
    products.sort((a, b) => Number(b.id) - Number(a.id))
  } else if (sort === 'name-asc') {
    products.sort((a, b) => String(a.name).localeCompare(String(b.name)))
  }

  const total = products.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const normalizedPage = Math.min(page, totalPages)
  const start = (normalizedPage - 1) * limit
  const pagedProducts = products.slice(start, start + limit)

  res.json({
    ok: true,
    products: pagedProducts,
    pagination: {
      total,
      page: normalizedPage,
      limit,
      totalPages,
    },
  })
})

app.get('/api/products/:id', (req, res) => {
  const db = readDb()
  const product = db.products.find((item) => item.id === Number(req.params.id))

  if (!product) {
    return res.status(404).json({ ok: false, message: 'Product not found.' })
  }

  return res.json({ ok: true, product })
})

app.get('/api/cart/:userId', (req, res) => {
  const db = readDb()
  const userId = Number(req.params.userId)
  const cart = db.carts.find((entry) => entry.userId === userId)
  return res.json({ ok: true, items: cart ? cart.items : [] })
})

app.post('/api/cart/:userId/add', (req, res) => {
  const userId = Number(req.params.userId)
  const productId = Number(req.body?.productId)

  if (!productId) {
    return res.status(400).json({ ok: false, message: 'productId is required.' })
  }

  const db = readDb()
  const product = db.products.find((item) => item.id === productId)

  if (!product) {
    return res.status(404).json({ ok: false, message: 'Product not found.' })
  }

  let cart = db.carts.find((entry) => entry.userId === userId)
  if (!cart) {
    cart = { userId, items: [] }
    db.carts.push(cart)
  }

  const existing = cart.items.find((item) => item.productId === productId)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.items.push({
      productId,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  writeDb(db)
  return res.json({ ok: true, message: 'Added to cart.', items: cart.items })
})

app.delete('/api/cart/:userId/items/:productId', (req, res) => {
  const userId = Number(req.params.userId)
  const productId = Number(req.params.productId)

  const db = readDb()
  const cart = db.carts.find((entry) => entry.userId === userId)

  if (!cart) {
    return res.json({ ok: true, items: [] })
  }

  cart.items = cart.items.filter((item) => item.productId !== productId)
  writeDb(db)

  return res.json({ ok: true, items: cart.items })
})

app.listen(PORT, () => {
  console.log(`sam's candels API running on http://localhost:${PORT}`)
})
