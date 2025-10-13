# Medical Inventory Management System

A comprehensive medical inventory management system built with React frontend and Node.js/Express backend, featuring Clerk authentication.

## Features

- 🔐 **Secure Authentication** - Powered by Clerk with role-based access control
- 📊 **Real-time Dashboard** - Comprehensive analytics and monitoring
- 💊 **Inventory Management** - Track medicines, expiry dates, and stock levels
- 📦 **Order Management** - Complete order lifecycle from creation to delivery
- 🏢 **Supplier Management** - Manage supplier relationships and performance
- 📈 **Reports & Analytics** - Detailed reports and insights
- 🎨 **Modern UI** - Beautiful, responsive interface with dark/light themes
- 🔒 **Role-based Permissions** - Different access levels for different user types

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Clerk Authentication
- React Router DOM
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Clerk SDK
- Express Rate Limiting
- Helmet Security

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Clerk account for authentication

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Medical_Inventory_System
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your Clerk publishable key
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Update .env with your configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meditrack
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Clerk Configuration

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys
4. Update the environment files with your keys
5. Configure allowed origins in Clerk dashboard:
   - `http://localhost:3000` (development)
   - Your production domain

### 5. Database Setup

Make sure MongoDB is running locally or update the connection string in `.env` to point to your MongoDB instance.

### 6. Running the Application

#### Development Mode

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd ../
npm start
```

#### Production Mode

```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/health` - Health check for authenticated users

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user by ID (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)

### Inventory
- `GET /api/inventory` - Get all medicines
- `GET /api/inventory/:id` - Get medicine by ID
- `POST /api/inventory` - Create new medicine
- `PUT /api/inventory/:id` - Update medicine
- `DELETE /api/inventory/:id` - Deactivate medicine
- `GET /api/inventory/alerts/low-stock` - Get low stock medicines
- `GET /api/inventory/alerts/expiring` - Get expiring medicines

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Deactivate supplier

### Reports
- `GET /api/reports/dashboard` - Get dashboard overview
- `GET /api/reports/inventory` - Get inventory analytics
- `GET /api/reports/orders` - Get order analytics
- `GET /api/reports/financial` - Get financial reports
- `GET /api/reports/system` - Get system statistics

## User Roles & Permissions

### Administrator
- Full access to all features
- User management
- System settings
- All reports and analytics

### Pharmacist
- Dashboard access
- Inventory management
- Order management
- Reports access
- No supplier management
- No settings access

### Inventory Manager
- Dashboard access
- Inventory management
- Supplier management
- Reports access
- No order management
- No settings access

### Staff
- Dashboard access
- Inventory viewing
- Order management
- No supplier management
- No reports access
- No settings access

### Viewer
- Dashboard access
- Read-only access to all data
- No management capabilities

## Environment Variables

### Frontend (.env.local)
```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meditrack
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email saranshmishra1529@gmail.com or byallasuresh8@gmail.com

## Acknowledgments

- Clerk for authentication services
- MongoDB for database
- React and Node.js communities
- All contributors and users