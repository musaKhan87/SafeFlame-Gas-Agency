import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../layout/Header'
import { useEffect, useRef, useState } from 'react';
import { bookCylinderWithProof, checkPendingBooking } from '../../services/api';
import { toast } from "react-toastify";

function BookCylinder() {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    quantity: 1,
    address: "",
    paymentMethod: "cash",
    paymentProof: null,
    paymentReference: "",
  });


  
  const [loading, setLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const checkPendingBookings = async () => {
      try {
        setCheckingStatus(true);
        const res = await checkPendingBooking();

        if (res.data.success && res.data.hasPendingBooking) {
          setPendingBooking(res.data.pendingBooking);
        }
      } catch (error) {
        toast.error("Failed to check booking status");
      } finally {
        setCheckingStatus(false);
      }
    };

    checkPendingBookings();
  }, []);

  // Set default address from user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        address: user.address,
      }));
    }
  }, [user]);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Check file type (only images)
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      setFormData({
        ...formData,
        paymentProof: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method,
      // Reset payment proof if switching to cash
      ...(method === "cash" && { paymentProof: null, paymentReference: "" }),
    });
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to book a cylinder");
      return;
    }

    if (pendingBooking) {
      toast.error(
        "You already have a pending booking. Please wait for it to be processed."
      );
      return;
    }

    if (user.cylindersRemaining < formData.quantity) {
      toast.error("Not enough cylinders remaining in your allocation");
      return;
    }

    // Validate payment proof for online payment
    if (formData.paymentMethod === "paytm" && !formData.paymentProof) {
      toast.error("Please upload payment proof for online payment");
      return;
    }

    if (formData.paymentMethod === "paytm" && !formData.paymentReference) {
      toast.error("Please enter payment reference number");
      return;
    }



    setLoading(true);

    try {
      // Create form data for file upload
      const bookingFormData = new FormData();
      bookingFormData.append("quantity", formData.quantity);
      bookingFormData.append("address", formData.address);
      bookingFormData.append("paymentMethod", formData.paymentMethod);

      if (formData.paymentMethod === "paytm") {
        bookingFormData.append("paymentProof", formData.paymentProof);
        bookingFormData.append("paymentReference", formData.paymentReference);
      }

      const res = await bookCylinderWithProof(bookingFormData);

      if (res.data.success) {
        toast.success("Booking created successfully");

        // Refresh user data to update cylinder count
        await refreshUserData();

        // Redirect to dashboard after successful booking
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to book cylinder");
    } finally {
      setLoading(false);
    }
  };


  if (checkingStatus) {
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

  return (
    <>
      <Header />
      <div className="container">
        <div className="booking-form">
          <h2>Book New Cylinder</h2>

          {pendingBooking ? (
            <div className="pending-booking-alert">
              <div className="notification notification-warning">
                <div className="notification-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    Pending Booking Exists
                  </div>
                  <div className="notification-message">
                    You already have a pending booking from{" "}
                    {new Date(pendingBooking.createdAt).toLocaleDateString()}{" "}
                    for {pendingBooking.quantity} cylinder(s). Please wait for
                    it to be processed before booking again.
                  </div>
                </div>
              </div>
              <button
                className="view-history-button"
                onClick={() => navigate("/booking-history")}
              >
                View Booking History
              </button>
            </div>
          ) : (
            <>
              <p>
                You have {user?.cylindersRemaining || 0} cylinders remaining in
                your allocation.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={user?.cylindersRemaining || 1}
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-methods">
                    <div
                      className={`payment-method ${
                        formData.paymentMethod === "cash" ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentMethodSelect("cash")}
                    >
                      <div className="payment-method-header">
                        <i className="fas fa-money-bill-wave payment-method-icon"></i>
                        <span className="payment-method-title">
                          Cash on Delivery
                        </span>
                      </div>
                      <div className="payment-method-description">
                        Pay when your cylinder is delivered
                      </div>
                    </div>

                    <div
                      className={`payment-method ${
                        formData.paymentMethod === "paytm" ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentMethodSelect("paytm")}
                    >
                      <div className="payment-method-header">
                        <i className="fas fa-qrcode payment-method-icon"></i>
                        <span className="payment-method-title">Paytm QR</span>
                      </div>
                      <div className="payment-method-description">
                        Pay using Paytm QR code
                      </div>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === "paytm" && (
                  <div id="paytm-qr-section">
                    <div className="qr-code-container">
                      <p>Scan this QR code to pay</p>
                      <img
                        src="/QR.png"
                        alt="Paytm QR Code"
                        className="qr-code"
                      />

                      <div className="form-group">
                        <label htmlFor="paymentReference">
                          Payment Reference Number
                        </label>
                        <input
                          type="text"
                          id="paymentReference"
                          value={formData.paymentReference}
                          onChange={handleChange}
                          placeholder="Enter transaction ID or reference number"
                          required={formData.paymentMethod === "paytm"}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="paymentProof">
                          Upload Payment Screenshot
                        </label>
                        <div className="file-upload-container">
                          <input
                            type="file"
                            id="paymentProof"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input"
                            required={formData.paymentMethod === "paytm"}
                          />
                          <button
                            type="button"
                            className="file-upload-btn"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <i className="fas fa-upload"></i> Choose File
                          </button>
                          <span className="file-name">
                            {formData.paymentProof
                              ? formData.paymentProof.name
                              : "No file chosen"}
                          </span>
                        </div>
                      </div>

                      {previewUrl && (
                        <div className="image-preview">
                          <p>Preview:</p>
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Payment proof preview"
                          />
                        </div>
                      )}

                      <div className="payment-instructions">
                        <h4>Payment Instructions:</h4>
                        <ol>
                          <li>Scan the QR code using Paytm or any UPI app</li>
                          <li>
                            Pay the amount based on your cylinder quantity (₹800
                            per cylinder)
                          </li>
                          <li>Take a screenshot of the successful payment</li>
                          <li>
                            Upload the screenshot and enter the reference number
                          </li>
                          <li>Submit your booking</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Book Now"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BookCylinder
