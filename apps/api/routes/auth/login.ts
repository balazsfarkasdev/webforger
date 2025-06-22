import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/clientadmin-login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const user = await prisma.clientUser.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.json({
      success: true,
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/superadmin-login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const user = await prisma.clientUser.findUnique({ where: { email } })

    if (!user?.isSuperAdmin) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (!user || user?.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.json({ success: true, companyId: user.companyId, firstName: user.firstName, lastName: user.lastName })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default router