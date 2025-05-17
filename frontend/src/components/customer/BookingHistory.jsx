import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { toast } from "react-toastify";
import { getBookingHistory } from '../../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setLoading(true);
        const res = await getBookingHistory();

        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (error) {
        toast.error("Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  // Filter bookings based on selected status
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);



  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <h2>Booking History</h2>
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="booking-history-header">
          <h2>Booking History</h2>
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
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
                    <td>{booking.remarks || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    {filter === "all"
                      ? "No booking history available"
                      : `No ${filter} bookings found`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {bookings.length > 0 && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-title">Total Bookings</div>
                <div className="summary-value">{bookings.length}</div>
              </div>
              <div className="summary-card">
                <div className="summary-title">Pending</div>
                <div className="summary-value">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-title">Approved</div>
                <div className="summary-value">
                  {bookings.filter((b) => b.status === "approved").length}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-title">Rejected</div>
                <div className="summary-value">
                  {bookings.filter((b) => b.status === "rejected").length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookingHistory
