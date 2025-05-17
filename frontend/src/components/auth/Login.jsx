import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const { login, resendVerification, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success("Login successful!");
      } else {
        if (result.needsVerification) {
          setNeedsVerification(true);
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const result = await resendVerification(email);
      if (result.success) {
        toast.success("Verification email resent successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };
  if (needsVerification) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h2>Email Verification Required</h2>
        </div>
        <div className="verification-message">
          <i
            className="fas fa-envelope-open-text"
            style={{ fontSize: "48px", color: "#e74c3c", marginBottom: "20px" }}
          ></i>
          <p>
            Your email <strong>{email}</strong> needs to be verified before you
            can log in.
          </p>
          <p>
            Please check your inbox and click the verification link we sent you.
          </p>
          <p className="small-text">
            (If you don't see the email, please check your spam folder or junk
            mail)
          </p>
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="resend-button"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
        <div className="auth-links">
          <p>
            <Link to="/login" onClick={() => setNeedsVerification(false)}>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Login to Gas Agency</h2>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="auth-links">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
