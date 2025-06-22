import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.clientUser.findMany({ include: { company: true } })
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: 'Error fetching client users' })
    }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const user = await prisma.clientUser.findUnique({
      where: { id },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSuperAdmin: user.isSuperAdmin,
      companyId: user.companyId,
      companyName: user.companyName || null,
    })
  } catch (error) {
    console.error('Fetch user error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

// Create user
router.post('/', async (req, res) => {
    try {
        const { email, password, firstName, lastName, companyId, companyName } = req.body
        const user = await prisma.clientUser.create({
            data: { email, password, firstName, lastName, companyId, companyName },
        })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: 'Error creating client user' })
    }
})

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { email, password, firstName, lastName, companyId, companyName } = req.body
        const user = await prisma.clientUser.update({
            where: { id: req.params.id },
            data: { email, password, firstName, lastName, companyId, companyName },
        })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: 'Error updating client user' })
    }
})

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await prisma.clientUser.delete({ where: { id: req.params.id } })
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Error deleting client user' })
    }
})

export default router