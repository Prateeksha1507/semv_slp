import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  const token = getToken();
  const userData = getUser() ? JSON.parse(getUser()) : null;

  useEffect(() => {
    if (!token || !userData) return navigate("/login");
    if (userData.role !== "admin") return navigate("/login");
    fetchData();
  }, [token, navigate]);

const fetchData = async () => {
  try {
    // Fetch Borrow Requests
    const borrowRes = await axios.get("http://localhost:4000/api/borrows", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Separate the requests into pending and non-pending
    const pendingBorrowRequests = borrowRes.data
      .filter((r) => r.status === "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Sort by requestDate (newest first)
    
    const nonPendingBorrowRequests = borrowRes.data
      .filter((r) => r.status !== "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Sort by requestDate (newest first)
    
    // Combine pending and non-pending requests, with pending first
    const sortedBorrowRequests = [...pendingBorrowRequests, ...nonPendingBorrowRequests];
    setRequests(sortedBorrowRequests.slice(0, 5)); // Only show the top 5 requests

    // Fetch Donation Requests
    const donationRes = await axios.get("http://localhost:4000/api/donation-requests", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Separate the requests into pending and non-pending
    const pendingDonationRequests = donationRes.data
      .filter((d) => d.status === "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Sort by requestDate (newest first)
    
    const nonPendingDonationRequests = donationRes.data
      .filter((d) => d.status !== "pending")
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Sort by requestDate (newest first)
    
    // Combine pending and non-pending requests, with pending first
    const sortedDonationRequests = [...pendingDonationRequests, ...nonPendingDonationRequests];
    setDonationRequests(sortedDonationRequests.slice(0, 5)); // Only show the top 5 requests

    // Fetch Currently Borrowed Books (No change needed for this part)
    const borrowedRes = await axios.get(
      "http://localhost:4000/api/borrows/borrowed",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBorrowedBooks(borrowedRes.data.slice(0, 10)); // Show 10 borrowed books
  } catch (err) {
    console.error("Error fetching admin data:", err);
  }
};



  const handleAction = async (id, status, type) => {
    try {
      if (type === "borrow") {
        // Handling Borrow Request (Approve/Reject)
        await axios.patch(
          `http://localhost:4000/api/borrows/update/${id}`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Borrow request ${status} successfully`);
      } else if (type === "donation") {
        // Handling Donation Request (Approve/Reject)
        const actionUrl = `http://localhost:4000/api/donation-requests/${status.toLowerCase()}/${id}`;
        const response = await axios.patch(actionUrl, {}, { headers: { Authorization: `Bearer ${token}` } });
        alert(`Donation request ${status} successfully`);

        // After the action, refresh the state to reflect the updated status
        fetchData(); // Re-fetch the donation requests to update the UI
      }
    } catch (err) {
      console.error("Error updating request:", err);
      alert(err.response?.data?.message || "Error updating request");
    }
  };


  const handleReturn = async (borrowId) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/borrows/return/${borrowId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      alert("Book returned successfully");
    } catch (err) {
      console.error("Error returning book:", err);
      alert(err.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Borrow Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="request-card">
            <p>
              <strong>{r.userId?.name}</strong> requested <em>{r.bookId?.title}</em> - Status: {r.status}
            </p>
            {r.status === "pending" && r.bookId?.status !== "borrowed" && (
              <div className="request-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleAction(r._id, "approved", "borrow")}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(r._id, "rejected", "borrow")}
                >
                  Reject
                </button>
              </div>
            )}
            {r.status === "pending" && r.bookId?.status === "borrowed" && (
              <p style={{ color: "red" }}>Book already borrowed</p>
            )}
          </div>
        ))
      )}
      {requests.length === 5 && (
        <button className="view-more-btn" onClick={() => navigate("/borrow-requests")}>
          View More Borrow Requests
        </button>
      )}

      <h2>Donation Requests</h2>
      {donationRequests.length === 0 ? (
        <p>No pending donation requests.</p>
      ) : (
        donationRequests.map((d) => (
          <div key={d._id} className="request-card">
            <p>
              <strong>{d.donor?.name}</strong> wants to donate <em>{d.title}</em> - Status: {d.status}
            </p>
            {d.status === "pending" && (
              <div className="request-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleAction(d._id, "approved", "donation")}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(d._id, "rejected", "donation")}
                >
                  Reject
                </button>
              </div>
            )}
            {d.status !== "pending" && (
              <p style={{ color: d.status === "approved" ? "green" : "red" }}>
                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
              </p>
            )}
          </div>
        ))
      )}
      {donationRequests.length === 5 && (
        <button className="view-more-btn" onClick={() => navigate("/donation-requests")}>
          View More Donation Requests
        </button>
      )}

      <h2>Currently Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No books currently borrowed.</p>
      ) : (
        borrowedBooks.map((b) => (
          <div key={b._id} className="request-card">
            <p>
              <strong>{b.borrower?.name}</strong> borrowed <em>{b.book?.title}</em>
            </p>
            <button className="approve-btn" onClick={() => handleReturn(b._id)}>
              Mark as Returned
            </button>
          </div>
        ))
      )}
      {borrowedBooks.length === 10 && (
        <button className="view-more-btn" onClick={() => navigate("/borrowed-books")}>
          View More Borrowed Books
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;
