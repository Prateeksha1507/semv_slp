import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Books.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(false); // 🔄 NEW
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 Reload when returning from /books/:id page
  useEffect(() => {
    if (location.state?.refresh) {
      setReloadTrigger(prev => !prev);
    }
  }, [location.state]);

  useEffect(() => {
    fetchBooks();
  }, [search, reloadTrigger]);

  const fetchBooks = async () => {
    try {
      const token = getToken();

      const url = search.trim()
        ? "http://localhost:4000/api/books/search"
        : "http://localhost:4000/api/books";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: search ? { search } : {},
      });

      // 🔽 SORT BY STATUS: Available → Borrowed → Reserved
      const sorted = res.data.sort((a, b) => {
        const order = { "available": 1, "reserved": 2, "borrowed": 3 };
        return order[a.status] - order[b.status];
      });

      setBooks(sorted);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading books...</p>;

  return (
    <div className="books-container">

      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>Available Books</h2>

      <div className="books">

        <div className="book-list">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="book-card" title={book.title}>

                <div className="book-cover-div">
                  <img
                    src={
                      book.coverImage ||
                      "https://via.placeholder.com/150?text=No+Cover"
                    }
                    alt={book.title}
                    className="book-cover"
                  />
                </div>

                <h3>{book.title}</h3>
                <p>By {book.author}</p>
                <p className="status">Status: {book.status}</p>

                <button
                  onClick={() =>
                    navigate(`/books/${book._id}`, {
                      state: { fromBooks: true }
                    })
                  }
                >
                  View
                </button>

              </div>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Books;
