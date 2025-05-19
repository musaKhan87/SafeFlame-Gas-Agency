
import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { toast } from "react-toastify";
import { getAllUsers } from '../../services/api';
import PageTransition from '../ui/PageTransition';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [useMobileCards, setUseMobileCards] = useState(
    window.innerWidth <= 480
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();

        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // Handle resize events to toggle between table and card view
    const handleResize = () => {
      setUseMobileCards(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <>
        <Header isAdmin={true} />
        <div className="container">
          <h2>Manage Users</h2>
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
          <h2>Manage Users</h2>
          <p>View and manage customer accounts</p>
        </div>

        <div className="search-container">
          <div className="form-group">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className={useMobileCards ? "use-mobile-cards" : ""}>
          {/* Table scroll indicator for mobile */}
          {filteredUsers.length > 0 &&
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Allocated</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="can-wrap">{user.address}</td>
                      <td>{user.cylindersAllocated}</td>
                      <td>{user.cylindersRemaining}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card view alternative */}
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div className="mobile-table-card" key={user._id}>
                <div className="mobile-table-card-header">
                  <div className="mobile-table-card-title">{user.name}</div>
                </div>
                <div className="mobile-table-card-content">
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Email</div>
                    <div className="mobile-table-card-value">{user.email}</div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Phone</div>
                    <div className="mobile-table-card-value">{user.phone}</div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Address</div>
                    <div className="mobile-table-card-value">
                      {user.address}
                    </div>
                  </div>
                  <div className="mobile-table-card-item">
                    <div className="mobile-table-card-label">Cylinders</div>
                    <div className="mobile-table-card-value">
                      {user.cylindersRemaining} / {user.cylindersAllocated}
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
                <div className="notification-message">No users found</div>
              </div>
            </div>
          )}
        </div>

        <div className="user-stats">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-title">Total Users</div>
              <div className="summary-value">{users.length}</div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Active Users</div>
              <div className="summary-value">
                {users.filter((user) => user.verified).length}
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-title">Pending Verification</div>
              <div className="summary-value">
                {users.filter((user) => !user.verified).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ManageUsers
