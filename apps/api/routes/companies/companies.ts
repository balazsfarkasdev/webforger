import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) return res.status(404).json({ message: 'Company not found' })

    res.json(company)
  } catch (error) {
    console.error('Failed to fetch company:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/company/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) return res.status(404).json({ message: 'Company not found' });

    res.json(company);
  } catch (error) {
    console.error('Failed to fetch company by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, slug, email, layout } = req.body;
  const company = await prisma.company.create({
    data: { name, slug, email, layout },
  });
  res.json(company);
});

router.put('/:id', async (req, res) => {
  const { id: companyId } = req.params
    const updateDateData = req.body

  try {
    const updated = await prisma.company.update({
        where: { id: companyId },
        data: updateDateData
    })

    res.json({ success: true, updated })
  } catch (error) {
    console.error('Failed to update sections:', error)
    res.status(500).json({ message: 'Failed to update sections' })
  }
})

router.put('/:id/sections', async (req, res) => {
  const { id: companyId } = req.params
  const { pageSections } = req.body

  try {
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { pageSections },
    })

    res.json({ success: true, updated })
  } catch (error) {
    console.error('Failed to update sections:', error)
    res.status(500).json({ message: 'Failed to update sections' })
  }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCompany = await prisma.company.delete({
            where: { id }
        });
        res.json(deletedCompany);
    } catch (error) {
        console.error('Failed to delete company:', error);
        res.status(500).json({ error: 'Failed to delete company' });
    }
});

export default router