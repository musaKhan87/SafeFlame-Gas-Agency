import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomerDashboard from "./components/customer/Dashboard";
import BookCylinder from "./components/customer/BookCylinder";
import BookingHistory from "./components/customer/BookingHistory";

import AdminDashboard from "./components/admin/Dashboard";
import ManageUsers from "./components/admin/ManageUser";
import CreateNotification from "./components/admin/CreateNotification";
import AccountBalance from "./components/customer/AccountBalance";
import PaymentVerification from "./components/admin/PaymentVerification";

const ProtectedRoute = ({ element, adminOly = false }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminOly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
};

function App() {
  const router = createBrowserRouter([
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
  ]);

  return (
    <>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
