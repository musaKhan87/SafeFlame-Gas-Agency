import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const logEvent = async (action, details = {}) => {
  try {
    await api.post("/logs", {
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

export const getUser = () => {
  return api.get("/auth/me");
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const reverify = (email) => {
  return api.post("/auth/resend-verification", { email });
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const verifyUser = (token) => {
  return api.get(`/auth/verify-email/${token}`);
};

export const createNotification = (notificationData) => {
  logEvent("Create notification", { title: notificationData.title });
  return api.post("/admin/notifications", notificationData);
};

export const getAllUsers = () => api.get("/admin/users");

export const getPendingBookings = () => api.get("/admin/bookings/pending");

export const updateBookingStatus = async (bookingId, status, remarks) => {
  logEvent("Update booking status", { bookingId, status });
  return api.put(`/admin/bookings/${bookingId}`, { status, remarks });
};

export const getBalance = () => {
  return api.get("/bookings/balance");
}

export const checkPendingBooking = () => {
  return api.get("/bookings/check-pending")
}

export const bookingCylinder = (bookingData) => {
  logEvent("Cylinder booking attempt", { quantity: bookingData.quantity })
  return api.post("/bookings", bookingData)
};

export const bookCylinderWithProof = (formData) => {
  logEvent("Cylinder booking with payment proof", {
    quantity: formData.get("quantity"),
  });
  return api.post("/bookings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBookingHistory = () => api.get("/bookings/history");

export const getNotifications = () => api.get("/notifications")

export const emailBalance = () => api.post("/bookings/email-balance");

export const getPaymentVerfication = () =>
  api.get("/admin/bookings/payment-verification");

export const verifyPayment = (bookingId, verified, remarks) => {
  logEvent("Verify payment", { bookingId, verified });
  return api.put(`/admin/bookings/${bookingId}/verify-payment`, {
    verified,
    remarks,
  });
};