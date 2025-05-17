import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyUser } from "../../services/api";

function VerifyEmail() {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const res = await verifyUser(token);
        setVerificationStatus("success");
        setMessage(res.data.message);
      } catch (error) {
        setVerificationStatus("error");
        setMessage(error.response?.data?.error || "Verification failed");
      }
    };

    verifyEmailToken();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Email Verification</h2>
      </div>

      <div className="verification-result">
        {verificationStatus === "verifying" && (
          <div className="verifying">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="success-message">
            <i
              className="fas fa-check-circle"
              style={{
                fontSize: "48px",
                color: "#2ecc71",
                marginBottom: "20px",
              }}
            ></i>
            <h3>Verification Successful!</h3>
            <p>{message}</p>
            <p>
              Your email has been verified successfully. You can now log in to
              your account.
            </p>
            <Link to="/login" className="login-button">
              Go to Login
            </Link>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="error-message">
            <i
              className="fas fa-times-circle"
              style={{
                fontSize: "48px",
                color: "#e74c3c",
                marginBottom: "20px",
              }}
            ></i>
            <h3>Verification Failed</h3>
            <p>{message}</p>
            <p>The verification link may be invalid or expired.</p>
            <Link to="/login" className="login-button">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
