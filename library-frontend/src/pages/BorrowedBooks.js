import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../api";
import "./AdminDashboard.css";

const BorrowedBooks= () => {
  const [books, setBooks] = useState([]);
  const token = getToken();

  useEffect(() => {
    const fetchBorrowed = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/borrows/borrowed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching borrowed books:", err);
      }
    };
    fetchBorrowed();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>All Borrowed Books</h2>
      {books.length === 0 ? (
        <p className="empty-text">No books currently borrowed.</p>
      ) : books.map((b) => (
        <div key={b._id} className="request-card">
          <p>
            <strong>{b.borrower?.name}</strong> borrowed <em>{b.book?.title}</em>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BorrowedBooks;
