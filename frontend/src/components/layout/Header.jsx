import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

function Header({ isAdmin = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

 

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };
return(
  <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
  <div className="container header-container">
    <div className="logo">
      <i className="fas fa-fire"></i>
      <span>Gas Agency {isAdmin ? "Admin" : ""}</span>
    </div>

    {/* Mobile menu toggle button */}
    <button
      className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
      onClick={toggleMobileMenu}
      aria-label="Toggle menu"
      aria-expanded={mobileMenuOpen}
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>

    {/* Navigation links - will be hidden on mobile and shown when menu is toggled */}
    <div className={`nav-container ${mobileMenuOpen ? "mobile-menu-open" : ""}`}>
      <ul className="nav-links">
        {isAdmin ? (
          // Admin Navigation Links
          <>
            <li className={isActive("/admin/dashboard") ? "active" : ""}>
              <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive("/admin/users") ? "active" : ""}>
              <Link to="/admin/users" onClick={closeMobileMenu}>
                <i className="fas fa-users"></i>
                <span>Manage Users</span>
              </Link>
            </li>
            <li className={isActive("/admin/payment-verification") ? "active" : ""}>
              <Link to="/admin/payment-verification" onClick={closeMobileMenu}>
                <i className="fas fa-check-circle"></i>
                <span>Payment Verification</span>
              </Link>
            </li>
            <li className={isActive("/admin/notifications") ? "active" : ""}>
              <Link to="/admin/notifications" onClick={closeMobileMenu}>
                <i className="fas fa-bell"></i>
                <span>Create Notification</span>
              </Link>
            </li>
          </>
        ) : (
          // Customer Navigation Links
          <>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard" onClick={closeMobileMenu}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive("/book-cylinder") ? "active" : ""}>
              <Link to="/book-cylinder" onClick={closeMobileMenu}>
                <i className="fas fa-shopping-cart"></i>
                <span>Book Cylinder</span>
              </Link>
            </li>
            <li className={isActive("/booking-history") ? "active" : ""}>
              <Link to="/booking-history" onClick={closeMobileMenu}>
                <i className="fas fa-history"></i>
                <span>Booking History</span>
              </Link>
            </li>
            <li className={isActive("/account-balance") ? "active" : ""}>
              <Link to="/account-balance" onClick={closeMobileMenu}>
                <i className="fas fa-wallet"></i>
                <span>Account Balance</span>
              </Link>
            </li>
          </>
        )}
        <li className="logout-item">
          <button
            onClick={() => {
              handleLogout()
              closeMobileMenu()
            }}
            className="nav-button"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  </div>

  {/* Overlay for mobile menu */}
  {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
</header>
)
}

export default Header;
