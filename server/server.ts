import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
