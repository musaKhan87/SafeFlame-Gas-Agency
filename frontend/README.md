# Gas Agency Management System

![Gas Agency System](https://via.placeholder.com/800x400?text=Gas+Agency+System)
admin Email:musa@gmail.com
admin password:musa@123

A comprehensive web application for managing gas cylinder bookings, payments, and deliveries. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Customer Features
- **User Authentication**: Secure registration and login with email verification
- **Cylinder Booking**: Book gas cylinders with multiple payment options
- **Online Payments**: Upload payment proof for online transactions
- **Booking History**: Track all past and pending bookings
- **Account Balance**: Monitor cylinder allocation and usage
- **Notifications**: Receive important updates from the agency

### Admin Features
- **Dashboard**: Overview of bookings, payments, and users
- **Booking Management**: Approve or reject booking requests
- **Payment Verification**: Verify online payments with proof
- **User Management**: View and manage customer accounts
- **Notifications**: Create announcements for all users

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- React-Toastify for notifications
- Framer Motion for animations
- Responsive CSS for all devices

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- Cloudinary for image storage

## 📱 Responsive Design

The application is fully responsive and optimized for all device sizes:

### Mobile Devices 
- Hamburger menu with slide-in navigation panel
- Stacked card layouts
- Optimized tables with horizontal scrolling
- Simplified forms and inputs
- Touch-friendly buttons and controls

### Tablets 
- Adaptive layouts that adjust to screen width
- Optimized card grids (2 columns)
- Responsive tables and forms
- Improved spacing and typography

### Desktops 
- Full navigation menu
- Multi-column layouts
- Expanded dashboard views
- Enhanced visual effects and animations

### Key Responsive Features
- **Fluid Typography**: Font sizes adjust based on screen size
- **Flexible Grids**: Card layouts adapt from 3 columns to 1 column
- **Mobile Navigation**: Custom mobile menu with smooth animations
- **Responsive Tables**: Horizontal scrolling for data tables on small screens
- **Adaptive Forms**: Form layouts and inputs adjust to screen width
- **Touch-Friendly**: Larger touch targets on mobile devices
- **Print Styles**: Optimized layout when printing pages

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account for image storage
- Email service for sending verification emails

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/gas-agency-system.git
   cd gas-agency-system
   \`\`\`

2. **Install server dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install client dependencies**
   \`\`\`bash
   cd frontend
   npm install
   cd ..
   \`\`\`

4. **Create environment variables**
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string

   # JWT Secret
   JWT_SECRET=your_secret_key_change_in_production

   # Client URL
   CLIENT_URL=http://localhost:5173

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   \`\`\`

5. **Run the application in development mode**
   \`\`\`bash
   npm run dev
   \`\`\`
   This will start both the backend server (port 5000) and the React frontend (port 3000).

## 🔐 Authentication and Security

- **Password Requirements**: Minimum 6 characters with strength indicator
- **Email Verification**: Verify user email before allowing login
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Authorization middleware for secure access
- **Input Validation**: Client and server-side validation
- **Password Encryption**: Secure password hashing with bcrypt

## 📁 Project Structure

\`\`\`
gas-agency-system/
├── backend/                  # Node.js backend
│   ├── controllers/          # API logic for routes
│   ├── middleware/           # Custom middleware (auth, error handling, etc.)
│   ├── models/               # Mongoose data models
│   ├── routes/               # API route handlers
│   ├── utils/                # Helper functions (email, cloudinary, etc.)
│   └── server.js             # Express server entry point
│
├── frontend/
|   ├── src/                      # React source files
|   │   ├── assets/              # Images, fonts, and static assets
│   |   ├── components/          # Modular UI components
│   │   |   ├── admin/           # Admin-specific UI components
│   │   |   ├── auth/            # Login, registration, verification
│   │   |   ├── customer/        # Customer-side features
│   │   |   ├── layout/          # Navbar, sidebar, footer, etc.
│   │   |   └── ui/              # Shared/reusable UI elements (buttons, modals)
│   |   ├── context/             # React Context API for global state
│   |   ├── services/            # API calls using Axios
│   |   ├── App.css              # Main CSS for App component
│   |   ├── App.jsx              # Root component containing routes/layout
│   |   ├── index.css            # Global styles
│   |   ├── main.jsx             # ReactDOM.render logic
|   ├── public/                  # Static public files (favicon, etc.)
|   ├── .gitignore               # Git ignored files
|   ├── eslint.config.js         # ESLint rules
|   ├── index.html               # HTML entry point
|   ├── vite.config.js           # Vite configuration
|   ├── package.json             # Project metadata and dependencies
|   ├── package-lock.json        # Exact version locks
|   ├── README.md                # Project overview
├── .env                      # Environment variables
├── package.json              # Project metadata and dependencies 
└── package-lock.json         # Dependency lock file

\`\`\`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify user email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user data

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/history` - Get user's booking history
- `GET /api/bookings/check-pending` - Check for pending bookings
- `GET /api/bookings/balance` - Get user's cylinder balance
- `POST /api/bookings/email-balance` - Send balance details via email

### Admin
- `GET /api/admin/bookings/pending` - Get all pending bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/users` - Get all users
- `POST /api/admin/notifications` - Create a notification
- `GET /api/admin/bookings/payment-verification` - Get bookings needing payment verification
- `PUT /api/admin/bookings/:id/verify-payment` - Verify payment for a booking
- `GET /api/admin/bookings/:id/payment-proof` - Get payment proof image

### Notifications
- `GET /api/notifications` - Get all notifications

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

Musa Khan - Full stack developer - [GitHub](https://github.com/musaKhan87)

\`\`\`
