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

import authRoutes from '../routes/auth/login'
app.use('/api/auth', authRoutes)

import clientUserRoutes from '../routes/client-users/clientUser'
app.use('/api/client-users', clientUserRoutes)

import companyRoutes from "../routes/companies/companies"
app.use('/api/companies', companyRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
