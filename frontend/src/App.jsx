"use client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";

// Customer Pages
import CustomerDashboard from "./components/customer/Dashboard";
import BookCylinder from "./components/customer/BookCylinder";
import BookingHistory from "./components/customer/BookingHistory";
import AccountBalance from "./components/customer/AccountBalance";

// Admin Pages
import AdminDashboard from "./components/admin/Dashboard";
import ManageUsers from "./components/admin/ManageUser";
import CreateNotification from "./components/admin/CreateNotification";
import PaymentVerification from "./components/admin/PaymentVerification";

// Spinner while loading auth
const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

// Protected Route Logic
const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin")
    return <Navigate to="/dashboard" replace />;

  return element;
};

// Layout to handle animations between routes
const AnimatedRoutesWrapper = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Outlet key={location.pathname} />
    </AnimatePresence>
  );
};

// Define routes using children structure for animated outlet
const routes = [
  {
    element: <AnimatedRoutesWrapper />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-email/:token",
        element: <VerifyEmail />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<CustomerDashboard />} />,
      },
      {
        path: "/book-cylinder",
        element: <ProtectedRoute element={<BookCylinder />} />,
      },
      {
        path: "/booking-history",
        element: <ProtectedRoute element={<BookingHistory />} />,
      },
      {
        path: "/account-balance",
        element: <ProtectedRoute element={<AccountBalance />} />,
      },
      {
        path: "/admin/dashboard",
        element: <ProtectedRoute adminOnly element={<AdminDashboard />} />,
      },
      {
        path: "/admin/users",
        element: <ProtectedRoute adminOnly element={<ManageUsers />} />,
      },
      {
        path: "/admin/payment-verification",
        element: <ProtectedRoute adminOnly element={<PaymentVerification />} />,
      },
      {
        path: "/admin/notifications",
        element: <ProtectedRoute adminOnly element={<CreateNotification />} />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

function App() {
  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
