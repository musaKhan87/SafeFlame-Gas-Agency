import { useState } from "react";
import { createNotification } from "../../services/api";
import Header from "../layout/Header"
import { toast } from "react-toastify";

function CreateNotification() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createNotification(formData);

      if (res.data.success) {
        toast.success("Notification created successfully");

        // Clear form
        setFormData({
          title: "",
          message: "",
          type: "info",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to create notification"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <Header isAdmin={true} />
    <div className="container">
      <div className="booking-form">
        <h2>Create Notification</h2>
        <p>Create a notification that will be visible to all users</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" value={formData.message} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" value={formData.type} onChange={handleChange}>
              <option value="info">Information</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Notification"}
          </button>
        </form>
      </div>
    </div>
  </>
  )
}

export default CreateNotification
