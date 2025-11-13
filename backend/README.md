# Food Ordering Backend API

A professional, advanced backend for a food ordering application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, protected routes)
- Menu management (CRUD operations)
- Order processing
- Role-based access control (user/admin)
- Advanced filtering, sorting, and pagination
- Error handling and validation
- JWT authentication
- MongoDB integration with Mongoose

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js for password hashing
- Dotenv for environment variables
- Cors for cross-origin resource sharing
- Multer for file uploads
- Validator for input validation

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file based on `.env.example`
5. Start the development server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAX_FILE_UPLOAD=1000000
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current logged in user (Protected)

### Menu Items

- `GET /api/v1/menu` - Get all menu items (Public)
- `POST /api/v1/menu` - Create a new menu item (Admin only)
- `GET /api/v1/menu/:id` - Get a single menu item (Public)
- `PUT /api/v1/menu/:id` - Update a menu item (Admin only)
- `DELETE /api/v1/menu/:id` - Delete a menu item (Admin only)

### Orders

- `POST /api/v1/orders` - Create a new order (Protected)
- `GET /api/v1/orders/:id` - Get order by ID (Protected)
- `PUT /api/v1/orders/:id/pay` - Update order to paid (Protected)
- `GET /api/v1/orders/myorders` - Get logged in user orders (Protected)
- `GET /api/v1/orders` - Get all orders (Admin only)
- `PUT /api/v1/orders/:id/deliver` - Update order to delivered (Admin only)

## Advanced Features

### Filtering

- `GET /api/v1/menu?category=main-course`
- `GET /api/v1/menu?price[gte]=100&price[lte]=500`

### Sorting

- `GET /api/v1/menu?sort=price`
- `GET /api/v1/menu?sort=-price,name`

### Pagination

- `GET /api/v1/menu?page=2&limit=5`

### Field Selection

- `GET /api/v1/menu?select=name,price`

## Role-Based Access

- **User**: Can view menu items, create orders, and manage their own orders
- **Admin**: Can perform all user actions plus manage menu items and all orders

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Server errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Role-based access control
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Development

- Nodemon for automatic server restarts during development
- Environment-specific configuration
- Modular code structure with controllers, models, and routes
- Async/await for handling asynchronous operations
- Error handling middleware for consistent error responses

## License

MIT