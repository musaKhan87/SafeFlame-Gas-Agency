import Header from '../layout/Header'
import { Modal } from '../ui/modal'
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { getPaymentVerfication, verifyPayment } from '../../services/api';

function PaymentVerification() {

    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [imageUrl, setImageUrl] = useState("");


 useEffect(() => {
   fetchPendingPayments();
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

    try {
      // Get the base URL
        const baseUrl = "/api"
      // Set the image URL
      setImageUrl(`${baseUrl}/admin/bookings/${booking._id}/payment-proof`);

      // Open the modal
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to load payment proof");
    }
    };
    
    
  const handleVerifyPayment = async (verified) => {
    if (!selectedBooking) return;

    try {
      setVerifying(true);

      const res = await verifyPayment(
        selectedBooking._id,
        verified,
        remarks
      );

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
              <h2>Payment Verification</h2>
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            </div>
          </>
        )
      }
    
      return (
        <>
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
                    There are no online payments waiting for verification at this time.
                  </div>
                </div>
              </div>
            ) : (
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
                        <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td>₹{booking.quantity * 800}</td>
                        <td>{booking.paymentReference || "N/A"}</td>
                        <td className="actions">
                          <button className="view" onClick={() => handleViewProof(booking)}>
                            <i className="fas fa-eye"></i> View Proof
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
    
            {/* Payment Proof Modal */}
            {showModal && selectedBooking && (
              <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Payment Verification">
                <div className="payment-verification-modal">
                  <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p>
                      <strong>Customer:</strong> {selectedBooking.userName}
                    </p>
                    <p>
                      <strong>Booking Date:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedBooking.quantity} cylinder(s)
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{selectedBooking.quantity * 800}
                    </p>
                    <p>
                      <strong>Reference:</strong> {selectedBooking.paymentReference || "N/A"}
                    </p>
                  </div>
    
                  <div className="payment-proof">
                    <h3>Payment Proof</h3>
                    <div className="proof-image-container">
                      <img src={imageUrl || "/placeholder.svg"} alt="Payment Proof" className="proof-image" />
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
                      <button className="reject-btn" onClick={() => handleVerifyPayment(false)} disabled={verifying}>
                        <i className="fas fa-times"></i> Reject Payment
                      </button>
                      <button className="verify-btn" onClick={() => handleVerifyPayment(true)} disabled={verifying}>
                        <i className="fas fa-check"></i> Verify Payment
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </>
  )
}

export default PaymentVerification
