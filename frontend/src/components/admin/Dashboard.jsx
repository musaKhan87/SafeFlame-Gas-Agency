import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { getAllUsers, getPaymentVerfication, getPendingBookings, updateBookingStatus } from '../../services/api';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function AdminDashboard() {

  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch pending bookings and all users in parallel
        const [bookingsRes, paymentsRes, usersRes] = await Promise.all([
          getPendingBookings(),
          getPaymentVerfication(),
          getAllUsers(),
        ]);

        if (bookingsRes.data.success) {
          setPendingBookings(bookingsRes.data.bookings);
        }

        if (paymentsRes.data.success) {
          setPendingPayments(paymentsRes.data.bookings);
        }

        if (usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveBooking = async (bookingId) => {
    const remarks = prompt("Enter any remarks for approval:");

    try {
      const res = await updateBookingStatus(bookingId, "approved", remarks);

      if (res.data.success) {
        toast.success("Booking approved successfully");

        // Update the pending bookings list
        setPendingBookings(
          pendingBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve booking");
    }
  };

  
  const handleRejectBooking = async (bookingId) => {
    const remarks = prompt("Enter reason for rejection:");

    if (!remarks) {
      toast.warning("Please provide a reason for rejection");
      return;
    }

    try {
      const res = await updateBookingStatus(bookingId, "rejected", remarks);

      if (res.data.success) {
        toast.success("Booking rejected successfully");

        // Update the pending bookings list
        setPendingBookings(
          pendingBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reject booking");
    }
  };

  if (loading) {
    return (
      <>
        <Header isAdmin={true} />
        <div className="container">
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header isAdmin={true} />
      <div className="container dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Admin Dashboard</h2>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pending Bookings</h3>
              <i className="fas fa-clock card-icon"></i>
            </div>
            <div className="card-value">{pendingBookings.length}</div>
            <div className="card-description">Bookings awaiting approval</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pending Payments</h3>
              <i className="fas fa-money-bill-wave card-icon"></i>
            </div>
            <div className="card-value">{pendingPayments.length}</div>
            <div className="card-description">
              Payments awaiting verification
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Total Users</h3>
              <i className="fas fa-users card-icon"></i>
            </div>
            <div className="card-value">{users.length}</div>
            <div className="card-description">Registered customers</div>
          </div>
        </div>

        {pendingPayments.length > 0 && (
          <div className="notification notification-warning">
            <div className="notification-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="notification-content">
              <div className="notification-title">
                Pending Payment Verification
              </div>
              <div className="notification-message">
                There are {pendingPayments.length} online payments waiting for
                verification.
                <Link
                  to="/admin/payment-verification"
                  className="notification-link"
                >
                  Verify Payments
                </Link>
              </div>
            </div>
          </div>
        )}

        <h3>Pending Bookings</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id.substring(0, 8)}...</td>
                    <td>{booking.userName}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td>{booking.quantity}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>
                      <span
                        className={`status-badge status-${
                          booking.paymentStatus === "verified"
                            ? "approved"
                            : booking.paymentStatus
                        }`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() +
                          booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="actions">
                      {booking.paymentMethod === "paytm" &&
                      booking.paymentStatus !== "verified" ? (
                        <Link to="/admin/payment-verification" className="view">
                          Verify Payment
                        </Link>
                      ) : (
                        <>
                          <button
                            className="approve"
                            onClick={() => handleApproveBooking(booking._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject"
                            onClick={() => handleRejectBooking(booking._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No pending bookings</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3>Recent Users</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Cylinders Allocated</th>
                <th>Cylinders Remaining</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.slice(0, 5).map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.cylindersAllocated}</td>
                    <td>{user.cylindersRemaining}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard
