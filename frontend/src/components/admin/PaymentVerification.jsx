import Header from "../layout/Header";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { getPaymentVerfication, verifyPayment } from "../../services/api";
import PageTransition from "../ui/PageTransition";

function PaymentVerification() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [useMobileCards, setUseMobileCards] = useState(
    window.innerWidth <= 480
  );

  useEffect(() => {
    fetchPendingPayments();
    // Handle resize events to toggle between table and card view
    const handleResize = () => {
      setUseMobileCards(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await getPaymentVerfication();

      if (res.data.success) {
        setPendingPayments(res.data.bookings);
      }
    } catch (error) {
      toast.error("Failed to load pending payments");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProof = async (booking) => {
    setSelectedBooking(booking);
    setImageLoading(true);

    try {
      // Get the base URL
      const baseUrl = "/api";
      // Set the image URL
      setImageUrl(`${baseUrl}/admin/bookings/${booking._id}/payment-proof`);

      // Open the modal
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to load payment proof");
    } finally {
      setImageLoading(false);
    }
  };

  const handleVerifyPayment = async (verified) => {
    if (!selectedBooking) return;

    try {
      setVerifying(true);

      const res = await verifyPayment(selectedBooking._id, verified, remarks);

      if (res.data.success) {
        toast.success(res.data.message);
        setShowModal(false);
        fetchPendingPayments(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to verify payment");
    } finally {
      setVerifying(false);
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
    <PageTransition>
      <Header isAdmin={true} />
      <div className="container">
        <div className="admin-header">
          <h2>Payment Verification</h2>
          <p>Verify online payments made by customers</p>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="notification notification-info">
            <div className="notification-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="notification-content">
              <div className="notification-title">No Pending Payments</div>
              <div className="notification-message">
                There are no online payments waiting for verification at this
                time.
              </div>
            </div>
          </div>
        ) : (
          <div className={useMobileCards ? "use-mobile-cards" : ""}>
            {/* Table scroll indicator for mobile */}
            {!useMobileCards && window.innerWidth <= 576 && (
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
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking._id.substring(0, 8)}...</td>
                      <td>{booking.userName}</td>
                      <td>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td>₹{booking.quantity * 800}</td>
                      <td>{booking.paymentReference || "N/A"}</td>
                      <td className="actions">
                        <button
                          className="view"
                          onClick={() => handleViewProof(booking)}
                        >
                          <i className="fas fa-eye"></i> View Proof
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view alternative */}
            {pendingPayments.map((booking) => (
              <div className="mobile-table-card" key={booking._id}>
                <div className="mobile-table-card-header">
                  <div className="mobile-table-card-title">
                    #{booking._id.substring(0, 8)}
                  </div>
                  <div className="mobile-table-card-date">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mobile-table-card-content">
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Customer</div>
                    <div className="mobile-table-card-value">
                      {booking.userName}
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Amount</div>
                    <div className="mobile-table-card-value">
                      ₹{booking.quantity * 800}
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Reference</div>
                    <div className="mobile-table-card-value">
                      {booking.paymentReference || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="mobile-table-card-actions">
                  <button
                    className="view"
                    onClick={() => handleViewProof(booking)}
                  >
                    <i className="fas fa-eye"></i> View Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Proof Modal */}
        {showModal && selectedBooking && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Payment Verification"
          >
            <div className="payment-verification-modal">
              <div className="booking-details">
                <h3>Booking Details</h3>
                <p>
                  <strong>Customer:</strong> {selectedBooking.userName}
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedBooking.quantity}{" "}
                  cylinder(s)
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedBooking.quantity * 800}
                </p>
                <p>
                  <strong>Reference:</strong>{" "}
                  {selectedBooking.paymentReference || "N/A"}
                </p>
              </div>

              <div className="payment-proof">
                <h3>Payment Proof</h3>
                <div className="proof-image-container">
                  {imageLoading ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Payment Proof"
                      className="proof-image"
                    />
                  ) : (
                    <div className="no-image">
                      No payment proof image available
                    </div>
                  )}
                </div>
              </div>

              <div className="verification-form">
                <div className="form-group">
                  <label htmlFor="remarks">Remarks (optional)</label>
                  <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any remarks about this payment"
                  />
                </div>

                <div className="verification-actions">
                  <button
                    className="reject-btn"
                    onClick={() => handleVerifyPayment(false)}
                    disabled={verifying}
                  >
                    <i className="fas fa-times"></i> Reject Payment
                  </button>
                  <button
                    className="verify-btn"
                    onClick={() => handleVerifyPayment(true)}
                    disabled={verifying}
                  >
                    <i className="fas fa-check"></i> Verify Payment
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PageTransition>
  );
}

export default PaymentVerification;
