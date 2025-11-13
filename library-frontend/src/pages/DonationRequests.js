import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/donation-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Separate pending and non-pending donation requests
        const pendingRequests = res.data.filter((r) => r.status === "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Newest first

        const nonPendingRequests = res.data.filter((r) => r.status !== "pending")
          .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); // Newest first

        // Combine pending requests first, followed by non-pending
        const sortedRequests = [...pendingRequests, ...nonPendingRequests];

        // Set the sorted requests (you can slice to show top 5 requests)
        setRequests(sortedRequests.slice(0, 5)); // Show top 5 most recent requests

      } catch (err) {
        console.error("Error fetching donation requests:", err);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>All Donation Requests</h2>
      {requests.length === 0 ? (
        <p className="empty-text">No donation requests.</p>
      ) : (
        requests.map((d) => (
          <div key={d._id} className="request-card">
            <p>
              <strong>{d.donor?.name || "Unknown Donor"}</strong> wants to donate <em>{d.title || "Untitled Book"}</em> by <strong>{d.author || "Unknown Author"}</strong>
            </p>
            <p>{d.description || "No description available."}</p>
            <p>Status: <span className={`status-${d.status}`}>{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span></p>
            <div className="request-actions">
              {d.status === "pending" && (
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

export default DonationRequests;
