import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);


  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^.{4,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
   
    if (!nameRegex.test(formData.name)) {
      toast.error("Name must be at least 4 characters long");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 6 characters and include letters and numbers"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      });

      if (result.success) {
        toast.success(
          result.message ||
            "Registration successful! Please check your email to verify your account."
        );
        setRegistered(true);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h2>Registration Successful!</h2>
        </div>
        <div className="verification-message">
          <i
            className="fas fa-envelope-open-text"
            style={{ fontSize: "48px", color: "#e74c3c", marginBottom: "20px" }}
          ></i>
          <p>
            We've sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p>
            Please check your inbox and click the verification link to activate
            your account.
          </p>
          <p className="small-text">
            (If you don't see the email, please check your spam folder or junk
            mail)
          </p>
        </div>
        <div className="auth-links">
          <p>
            Already verified? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Register</h2>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group password-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <input
              type={!showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
          </div>
        </div>

        <div className="form-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-with-icon">
            <input
              type={!showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <i
                className={`fa-solid ${
                  showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="auth-links">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
