const bookingConfirmationTemplate = (user, booking) => {
  const bookingDate = new Date(booking.createdAt).toLocaleDateString();
  const bookingTime = new Date(booking.createdAt).toLocaleTimeString();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px;">
      <h2 style="color: #e74c3c;">Gas Agency System - Booking Confirmation</h2>
      <p>Hello ${user.name},</p>
      <p>Your gas cylinder booking has been successfully created. Here are the details:</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Date:</strong> ${bookingDate} at ${bookingTime}</p>
        <p><strong>Quantity:</strong> ${booking.quantity} cylinder(s)</p>
        <p><strong>Delivery Address:</strong> ${booking.address}</p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
        <p><strong>Status:</strong> Pending</p>
      </div>
      
      <p>Your booking is now pending approval. We will notify you once it's approved or if there are any updates.</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Account Balance:</strong></p>
        <p>Cylinders Allocated: ${user.cylindersAllocated}</p>
        <p>Cylinders Remaining: ${user.cylindersRemaining}</p>
      </div>
      
      <p>Thank you for choosing our service!</p>
      <p>Regards,<br>Gas Agency Team</p>
    </div>
  `;
};

const bookingStatusUpdateTemplate = (user, booking) => {
  const statusDate = booking.updatedAt
    ? new Date(booking.updatedAt).toLocaleDateString()
    : "N/A";
  const statusTime = booking.updatedAt
    ? new Date(booking.updatedAt).toLocaleTimeString()
    : "N/A";

  // Determine status color and message
  let statusColor = "#f39c12"; // Default yellow for pending
  let statusMessage = "Your booking is being processed.";

  if (booking.status === "approved") {
    statusColor = "#2ecc71"; // Green for approved
    statusMessage =
      "Your booking has been approved. Your gas cylinder will be delivered soon.";
  } else if (booking.status === "rejected") {
    statusColor = "#e74c3c"; // Red for rejected
    statusMessage = `Your booking has been rejected. Reason: ${
      booking.remarks || "Not specified"
    }`;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px;">
      <h2 style="color: #e74c3c;">Gas Agency System - Booking Status Update</h2>
      <p>Hello ${user.name},</p>
      <p>There has been an update to your gas cylinder booking. Here are the details:</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Quantity:</strong> ${booking.quantity} cylinder(s)</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${booking.status.toUpperCase()}</span></p>
        <p><strong>Updated on:</strong> ${statusDate} at ${statusTime}</p>
        ${
          booking.remarks
            ? `<p><strong>Remarks:</strong> ${booking.remarks}</p>`
            : ""
        }
      </div>
      
      <p>${statusMessage}</p>
      
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Account Balance:</strong></p>
        <p>Cylinders Allocated: ${user.cylindersAllocated}</p>
        <p>Cylinders Remaining: ${user.cylindersRemaining}</p>
      </div>
      
      <p>Thank you for choosing our service!</p>
      <p>Regards,<br>Gas Agency Team</p>
    </div>
  `;
};

const accountBalanceTemplate = (user) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px;">
        <h2 style="color: #e74c3c;">Gas Agency System - Account Balance</h2>
        <p>Hello ${user.name},</p>
        <p>Here is your current account balance information:</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Account Balance:</strong></p>
          <p>Cylinders Allocated: ${user.cylindersAllocated}</p>
          <p>Cylinders Remaining: ${user.cylindersRemaining}</p>
          <p>Cylinders Used: ${
            user.cylindersAllocated - user.cylindersRemaining
          }</p>
        </div>
        
        <p>Thank you for choosing our service!</p>
        <p>Regards,<br>Gas Agency Team</p>
      </div>
    `;
};

module.exports = {
  bookingConfirmationTemplate,
  bookingStatusUpdateTemplate,
  accountBalanceTemplate,
};
