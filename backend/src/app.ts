import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { initDB } from './db/dbinit';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';
import allProductsRoutes from './routes/allproductsroute';
import userRoutes from './routes/user.route';
import { initRecommender } from './utils/recommender';


const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:4000',
    'https://industra-production.netlify.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/products', allProductsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Initialize DB


initDB();
initRecommender();

app.get('/', (req, res) => {
    res.json({ message: "Welcome to ShoppingPal" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
