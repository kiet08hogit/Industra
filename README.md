# Industra - Industrial Safety Equipment E-Commerce Platform

A full-stack e-commerce web application specializing in industrial safety equipment including hard hats, power tools, safety glasses, and safety gloves. Built with modern web technologies and featuring intelligent product recommendations powered by TF-IDF algorithms.

## 🚀 Features

- **User Authentication**: Secure authentication using Clerk with support for OAuth providers
- **Product Catalog**: Browse industrial safety products across multiple categories
- **Smart Search**: TF-IDF-based product search with relevance ranking
- **Personalized Recommendations**: AI-powered product recommendations based on user interaction history
- **Shopping Cart**: Add, update, and manage cart items with real-time updates
- **Order Management**: Complete checkout process with order history tracking
- **User Profiles**: Manage addresses and view order history
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Copilot Integration**: Interactive AI assistant for enhanced user experience

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Clerk SDK, JWT
- **Password Hashing**: bcrypt
- **Machine Learning**: Natural (TF-IDF for recommendations)
- **Data Processing**: CSV Parser for product data import

### Frontend
- **Framework**: React 18
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router DOM
- **Authentication**: Clerk React
- **HTTP Client**: Axios
- **Animations**: GSAP
- **Icons**: React Icons
- **Styling**: CSS Modules

## 📁 Project Structure

```
Industra/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── app.ts          # Application entry point
│   │   ├── controller/     # Route controllers
│   │   ├── db/             # Database models and initialization
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── type/           # TypeScript type definitions
│   │   └── utils/          # Utilities (recommender, password)
│   └── scripts/            # Data import and utility scripts
├── frontend/               # React frontend
│   ├── public/
│   │   └── images/         # Product images
│   └── src/
│       ├── components/     # React components
│       ├── data/           # Static data files
│       └── utils/          # API utilities
├── data/                   # Dataset and scraping scripts
│   └── Industrial_dataset/
│       ├── scrape_amz.py   # Amazon product scraper
│       └── industrial_data/ # CSV product data
└── image/                  # Product image repository
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Clerk account for authentication

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
CLIENT_URL=http://localhost:4000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=industra_db

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

4. Initialize the PostgreSQL database:
```bash
# Create database
psql -U postgres
CREATE DATABASE industra_db;
\q
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:4000`

## 📊 Database Schema

The application uses the following main tables:

- **users**: User account information with Clerk integration
- **carts**: User shopping carts
- **cart_items**: Individual items in carts
- **user_interactions**: Track user product views and purchases for recommendations
- **products**: Stored across category-specific tables (hard_hat, power_tools, safety_glasses, safety_gloves)

Tables are automatically created on first run via `dbinit.ts`.

## 📦 Data Import

Import product data from CSV files:

```bash
cd backend
npm run import-data
```

Update product image paths:

```bash
npm run update-images
```

## 🚀 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run import-data` - Import product data from CSV files
- `npm run update-images` - Update product image references

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:category` - Get products by category
- `GET /api/products/:category/:id` - Get single product
- `GET /api/products/search` - Search products with recommendations

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🤖 Recommendation Engine

The application features a sophisticated recommendation system using:
- **TF-IDF (Term Frequency-Inverse Document Frequency)** for content-based filtering
- **User interaction tracking** for personalized recommendations
- **Collaborative filtering** based on purchase and view history

## 🎨 Product Categories

- Hard Hats
- Power Tools
- Safety Glasses
- Safety Gloves

## 🔒 Security Features

- JWT-based authentication
- Clerk OAuth integration (Google, GitHub)
- Password hashing with bcrypt
- Protected routes and API endpoints
- CORS configuration for cross-origin requests

## 🌐 Environment Variables

### Required Backend Variables
- `PORT` - Backend server port
- `CLIENT_URL` - Frontend URL for CORS
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL credentials
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `JWT_SECRET` - JWT signing secret

### Required Frontend Variables
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_CLERK_PUBLISHABLE_KEY` - Clerk publishable key

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Product data sourced from Amazon using web scraping
- Authentication powered by Clerk
- UI components and design inspired by modern e-commerce platforms

## 📧 Contact

For questions or support, please open an issue in the repository.
