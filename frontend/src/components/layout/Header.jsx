import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header({ isAdmin = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

   const handleLogout = async () => {
     await logout();
     navigate("/login");
   };


   return (
     <header className="header">
       <div className="container header-container">
         <div className="logo">
           <i className="fas fa-fire"></i>
           <span>SafeFlame Gas Agency {isAdmin ? "- Admin" : ""}</span>
         </div>
         <ul className="nav-links">
           {isAdmin ? (
             // Admin Navigation Links
             <>
               <li>
                 <Link to="/admin/dashboard">Dashboard</Link>
               </li>
               <li>
                 <Link to="/admin/users">Manage Users</Link>
               </li>
               <li>
                 <Link to="/admin/payment-verification">
                   Payment Verification
                 </Link>
               </li>
               <li>
                 <Link to="/admin/notifications">Create Notification</Link>
               </li>
             </>
           ) : (
             // Customer Navigation Links
             <>
               <li>
                 <Link to="/dashboard">Dashboard</Link>
               </li>
               <li>
                 <Link to="/book-cylinder">Book Cylinder</Link>
               </li>
               <li>
                 <Link to="/booking-history">Booking History</Link>
               </li>
               <li>
                 <Link to="/account-balance">Account Balance</Link>
               </li>
             </>
           )}
           <li>
             <button onClick={handleLogout} className="nav-button">
               Logout
             </button>
           </li>
         </ul>
       </div>
     </header>
   );
}

export default Header;
