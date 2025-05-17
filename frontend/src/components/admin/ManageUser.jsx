
import { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { toast } from "react-toastify";
import { getAllUsers } from '../../services/api';

function ManageUsers() {
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
    <>
      <Header isAdmin={true} />
      <div className="container">
        <h2>Manage Users</h2>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Cylinders Allocated</th>
                <th>Cylinders Remaining</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
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
      </div>
    </>
  );
}

export default ManageUsers
