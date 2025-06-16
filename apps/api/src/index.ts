import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// You can add your API routes here
// e.g. app.use('/api/companies', companyRouter);

const PORT = process.env.PORT || 5000;

app.get('/api/companies', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

app.post('/api/companies', async (req, res) => {
  const { name, slug, email, layout } = req.body;
  const company = await prisma.company.create({
    data: { name, slug, email, layout },
  });
  res.json(company);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
