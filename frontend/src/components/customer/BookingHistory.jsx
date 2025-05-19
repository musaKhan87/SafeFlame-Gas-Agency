import { useEffect, useState } from "react";
import Header from "../layout/Header";
import { toast } from "react-toastify";
import { getBookingHistory } from "../../services/api";
import PageTransition from "../ui/PageTransition";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [useMobileCards, setUseMobileCards] = useState(
    window.innerWidth <= 480
  );

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
    // Handle resize events to toggle between table and card view
    const handleResize = () => {
      setUseMobileCards(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "fa-clock";
      case "approved":
        return "fa-check-circle";
      case "rejected":
        return "fa-times-circle";
      default:
        return "fa-info-circle";
    }
  };

  return (
    <PageTransition>
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
              aria-label="Filter bookings by status"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className={useMobileCards ? "use-mobile-cards" : ""}>
          {/* Table scroll indicator for mobile */}
          {filteredBookings.length > 0 &&
            !useMobileCards &&
            window.innerWidth <= 576 && (
              <div className="table-scroll-indicator">
                <i className="fas fa-arrows-left-right"></i> Swipe to see more
              </div>
            )}

          {/* Regular table view */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="can-wrap">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td>{booking.quantity}</td>
                      <td>
                        <span
                          className={`status-badge status-${booking.status}`}
                        >
                          <i
                            className={`fas ${getStatusIcon(booking.status)}`}
                          ></i>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </td>
                      <td>{booking.paymentMethod}</td>
                      <td className="can-wrap">{booking.remarks || "-"}</td>
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

          {/* Mobile card view alternative */}
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div className="mobile-table-card" key={booking._id}>
                <div className="mobile-table-card-header">
                  <div className="mobile-table-card-title">
                    Booking #{booking._id.substring(0, 8)}
                  </div>
                  <div className="mobile-table-card-date">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mobile-table-card-content">
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Quantity</div>
                    <div className="mobile-table-card-value">
                      {booking.quantity} cylinder(s)
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Payment</div>
                    <div className="mobile-table-card-value">
                      {booking.paymentMethod}
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Status</div>
                    <div className="mobile-table-card-value">
                      <span className={`status-badge status-${booking.status}`}>
                        <i
                          className={`fas ${getStatusIcon(booking.status)}`}
                        ></i>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Remarks</div>
                    <div className="mobile-table-card-value">
                      {booking.remarks || "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="notification notification-info">
              <div className="notification-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="notification-content">
                <div className="notification-message">
                  {filter === "all"
                    ? "No booking history available"
                    : `No ${filter} bookings found`}
                </div>
              </div>
            </div>
          )}
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
    </PageTransition>
  );
};

export default BookingHistory;
