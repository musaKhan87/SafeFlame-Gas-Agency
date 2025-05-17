import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../layout/Header";
import { toast } from "react-toastify";
import { emailBalance, getBalance } from "../../services/api";

function AccountBalance() {
    const { user } = useAuth();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
      const fetchBalance = async () => {
        try {
          setLoading(true);
          const res = await getBalance();

          if (isMounted && res.data.success) {
            setBalance(res.data.balance);
          }
        } catch (error) {
          if (isMounted) {
            toast.error("Failed to load account balance")
          }
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
    };
    
      fetchBalance();

      return () => {
        isMounted = false;
      };
    }, []);

    const handleSendEmail = async () => {
      try {
        setEmailSending(true);
        await emailBalance();
        toast.success("Account balance email sent successfully");
      } catch (error) {
        toast.error("Failed to send account balance email");
      } finally {
        setEmailSending(false);
      }
    };

    // Calculate usage percentage
    const usagePercentage = balance
      ? Math.round((balance.used / balance.allocated) * 100)
      : 0;

    // Determine color based on remaining cylinders
    const getStatusColor = () => {
      if (!balance) return "var(--success-color)";
      if (balance.remaining <= 2) return "var(--danger-color)";
      if (balance.remaining <= 4) return "var(--warning-color)";
      return "var(--success-color)";
  };
  
 
  
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
      )
    }
  
    return (
      <>
        <Header />
        <div className="container">
          <div className="account-balance-container">
            <h2>Account Balance</h2>
  
            <div className="balance-card">
              <div className="user-info">
                <h3>{user?.name}</h3>
                <p>
                  <i className="fas fa-envelope"></i> {user?.email}
                </p>
                <p>
                  <i className="fas fa-phone"></i> {user?.phone}
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i> {user?.address}
                </p>
              </div>
  
              <div className="balance-details">
                <div className="balance-item">
                  <div className="balance-label">Cylinders Allocated</div>
                  <div className="balance-value">{balance?.allocated || 0}</div>
                </div>
  
                <div className="balance-item">
                  <div className="balance-label">Cylinders Used</div>
                  <div className="balance-value">{balance?.used || 0}</div>
                </div>
  
                <div className="balance-item highlight">
                  <div className="balance-label">Cylinders Remaining</div>
                  <div className="balance-value" >{balance?.remaining || 0}</div>
                </div>
              </div>
  
              <div className="cylinder-icon-container">
                {[...Array(balance?.allocated || 0)].map((_, index) => (
                  <div key={index} className={`cylinder-icon ${index < balance?.used ? "active" : ""}`}>
                    <i className="fas fa-fire"></i>
                  </div>
                ))}
              </div>
  
              <div className="cylinder-count">
                You have used <span>{balance?.used || 0}</span> out of <span>{balance?.allocated || 0}</span> cylinders
              </div>
  
              <div className="balance-actions">
                <button className="email-balance-btn" onClick={handleSendEmail} disabled={emailSending}>
                  <i className="fas fa-envelope"></i>
                  {emailSending ? "Sending..." : "Email Balance Details"}
                </button>
              </div>
            </div>
  
            <div className="usage-chart">
              <h3>Cylinder Usage</h3>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${usagePercentage}%`,
                    backgroundColor: getStatusColor(),
                  }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>0</span>
                <span>{balance?.allocated}</span>
              </div>
              <p className="usage-text">
                You have used <strong>{balance?.used}</strong> out of <strong>{balance?.allocated}</strong> cylinders (
                {usagePercentage}%)
              </p>
  
              {balance?.remaining <= 2 && (
                <div className="notification notification-danger">
                  <div className="notification-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Low Cylinder Balance</div>
                    <div className="notification-message">
                      You have only {balance.remaining} cylinders remaining. Please use them wisely.
                    </div>
                  </div>
                </div>
              )}
  
              {balance?.remaining > 2 && balance?.remaining <= 4 && (
                <div className="notification notification-warning">
                  <div className="notification-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Cylinder Balance Notice</div>
                    <div className="notification-message">
                      You have {balance.remaining} cylinders remaining for this allocation period.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
}

export default AccountBalance
