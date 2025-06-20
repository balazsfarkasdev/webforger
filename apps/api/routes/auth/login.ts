import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const user = await prisma.clientUser.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // TODO: később JWT vagy session
    return res.json({ success: true, companyId: user.companyId })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  const { email, password, companyId } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.clientUser.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Verify company exists if companyId is provided
    if (companyId) {
      const company = await prisma.company.findUnique({ where: { id: companyId } })
      if (!company) {
        return res.status(400).json({ message: 'Invalid company ID' })
      }
    }

    // Create new user
    const newUser = await prisma.clientUser.create({
      data: {
        email,
        password, // TODO: Hash password in production
        companyId,
      },
    })

    return res.status(201).json({ 
      success: true, 
      companyId: newUser.companyId,
      message: 'User created successfully' 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default router