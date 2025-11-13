import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/borrows", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Separate pending and non-pending borrow requests
        const pendingRequests = res.data.filter((r) => r.status === "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Newest first

        const nonPendingRequests = res.data.filter((r) => r.status !== "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Newest first

        // Combine pending requests first, followed by non-pending
        const sortedRequests = [...pendingRequests, ...nonPendingRequests];

        // Set the sorted requests (you can slice to show top 5 requests)
        setRequests(sortedRequests.slice(0, 5)); // Show top 5 most recent requests

      } catch (err) {
        console.error("Error fetching borrow requests:", err);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>All Borrow Requests</h2>
      {requests.length === 0 ? (
        <p className="empty-text">No borrow requests.</p>
      ) : (
        requests.map((r) => (
          <div key={r._id} className="request-card">
            <p>
              <strong>{r.userId?.name || "Unknown User"}</strong> requested <em>{r.bookId?.title || "Untitled Book"}</em> - Status: {r.status}
            </p>
            <div className="request-actions">
              {r.status === "pending" && (
                <>
                  <button className="approve-btn">Approve</button>
                  <button className="reject-btn">Reject</button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BorrowRequests;
