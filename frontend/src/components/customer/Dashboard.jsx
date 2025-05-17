
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../layout/Header';
import { getBookingHistory, getNotifications } from '../../services/api';
import { toast } from "react-toastify";

function CustomerDashboard() {

  const { user, refreshUserData } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Call refreshUserData only once when component mounts
        if (isMounted) {
          await refreshUserData();

          // Fetch booking history and notifications in parallel
          const [bookingsRes, notificationsRes] = await Promise.all([
            getBookingHistory(),
            getNotifications(),
          ]);

          if (isMounted) {
            if (bookingsRes.data.success) {
              setBookings(bookingsRes.data.bookings);
            }

            if (notificationsRes.data.success) {
              setNotifications(notificationsRes.data.notifications);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load dashboard data");
          console.error("Dashboard data error:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); 


  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
  const recentBookings = bookings.slice(0, 5);

  return (
    <>
      <Header />
      <div className="container dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Welcome, {user?.name}</h2>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Cylinders Allocated</h3>
              <i className="fas fa-fire card-icon"></i>
            </div>
            <div className="card-value">{user?.cylindersAllocated || 0}</div>
            <div className="card-description">
              Total cylinders allocated for the year
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Cylinders Remaining</h3>
              <i className="fas fa-fire-alt card-icon"></i>
            </div>
            <div className="card-value">{user?.cylindersRemaining || 0}</div>
            <div className="card-description">
              Cylinders available for booking
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pending Bookings</h3>
              <i className="fas fa-clock card-icon"></i>
            </div>
            <div className="card-value">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="card-description">Bookings awaiting approval</div>
          </div>
        </div>

        <h3>Recent Notifications</h3>
        <div className="notifications-container">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification notification-${
                  notification.type || "info"
                }`}
              >
                <div className="notification-icon">
                  <i
                    className={`fas fa-${
                      notification.type === "success"
                        ? "check-circle"
                        : notification.type === "warning"
                        ? "exclamation-triangle"
                        : notification.type === "danger"
                        ? "times-circle"
                        : "info-circle"
                    }`}
                  ></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications available</p>
          )}
        </div>

        <h3>Recent Bookings</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
             {
              recentBookings.length > 0 ? (
                recentBookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id.substring(0, 8)}...</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td>{booking.quantity}</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td>{booking.paymentMethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No booking history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;
