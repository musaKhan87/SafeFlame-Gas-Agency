# Gas Agency Management System

![Gas Agency System](https://via.placeholder.com/800x400?text=Gas+Agency+System)

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

### Mobile Devices (< 576px)
- Hamburger menu with slide-in navigation panel
- Stacked card layouts
- Optimized tables with horizontal scrolling
- Simplified forms and inputs
- Touch-friendly buttons and controls

### Tablets (576px - 992px)
- Adaptive layouts that adjust to screen width
- Optimized card grids (2 columns)
- Responsive tables and forms
- Improved spacing and typography

### Desktops (> 992px)
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
   cd client
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
   CLIENT_URL=http://localhost:3000

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
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # React components
│       │   ├── admin/      # Admin components
│       │   ├── auth/       # Authentication components
│       │   ├── customer/   # Customer components
│       │   ├── layout/     # Layout components
│       │   └── ui/         # UI components
│       ├── context/        # Context providers
│       ├── services/       # API services
│       └── App.js          # Main app component
├── controllers/            # Route controllers
├── middleware/             # Express middleware
├── models/                 # MongoDB models
├── routes/                 # API routes
├── utils/                  # Utility functions
│   ├── cloudinary.js       # Cloudinary configuration
│   ├── emailService.js     # Email service
│   └── emailTemplates.js   # Email templates
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── server.js               # Express server
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

## 🚀 Deployment

### Deploying to Heroku
1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI: `heroku login`
3. Create a new Heroku app: `heroku create your-app-name`
4. Add MongoDB add-on or use MongoDB Atlas
5. Set environment variables in Heroku dashboard
6. Push to Heroku: `git push heroku main`

### Deploying to Vercel
1. Create a `vercel.json` file in the root directory:
   \`\`\`json
   {
     "version": 2,
     "builds": [
       { "src": "server.js", "use": "@vercel/node" },
       { "src": "client/build/**", "use": "@vercel/static" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server.js" },
       { "src": "/(.*)", "dest": "client/build/$1" }
     ]
   }
   \`\`\`
2. Build the client: `cd client && npm run build`
3. Deploy with Vercel CLI: `vercel --prod`

## 🧪 Testing

### Running Tests
\`\`\`bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test
\`\`\`

### Test Coverage
\`\`\`bash
# Generate backend test coverage
npm run test:coverage

# Generate frontend test coverage
cd client && npm run test:coverage
\`\`\`

## 🔄 Continuous Integration

The project uses GitHub Actions for continuous integration. Every push to the main branch triggers:
- Code linting
- Unit tests
- Build verification

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.
\`\`\`

## 3. Let's update the Header component to ensure it works well on all device sizes:
