import Book from "../models/Book.js";
import DonationRequest from "../models/DonationRequest.js";
import Donate from "../models/Donate.js";
import Member from "../models/Member.js";

export const booksController = {
  // Add book - Logic based on user role
  async addBook(req, res) {
    try {
      const { title, author, genres, description, coverImage } = req.body;
      const donorId = req.user?.id;
      if (!donorId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
      if (!title || !author)
        return res.status(400).json({ message: "Title and author are required" });

      const donor = await Member.findById(donorId);
      if (!donor) return res.status(404).json({ message: "Member not found" });

      // If the user is a member (donor), they should send a request instead of directly adding the book
      if (donor.role === "member") {
        const existingRequest = await DonationRequest.findOne({ donor: donorId, title, author, status: "pending" });
        if (existingRequest) {
          return res.status(400).json({ message: "Donation request for this book is already pending" });
        }

        const request = new DonationRequest({
          donor: donorId,
          title,
          author,
          genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
          description,
          coverImage,
        });

        await request.save();
        return res.status(201).json({
          message: `Donation request for "${title}" submitted successfully`,
          request,
        });
      }

      // If the user is an admin, directly add the book to the database
      const book = await Book.create({
        coverImage: coverImage || null,
        title,
        author,
        genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
        description,
        donor: donor.name,
        status: "available",
      });

      await Donate.create({
        donor: donorId,
        book: book._id,
      });

      res.status(201).json({
        message: `Book "${book.title}" donated successfully by ${donor.name}`,
        book,
      });
    } catch (e) {
      console.error("Error donating book:", e);
      res.status(500).json({
        message: "Failed to donate book",
        error: e.message,
      });
    }
  },

  // Get all books
  async getAllBooks(req, res) {
    try {
      const books = await Book.find();  // Fetch all books from the database
      res.json(books);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  // Get a specific book by its ID
  async getBookById(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  // Update book details
  async updateBook(req, res) {
    try {
      const { bookId } = req.params;
      const { title, author, genres, description, coverImage } = req.body;

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { title, author, genres, description, coverImage },
        { new: true } // This will return the updated book
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json({ message: "Book updated successfully", updatedBook });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  // Delete a book
  async deleteBook(req, res) {
    try {
      const { bookId } = req.params;
      const deletedBook = await Book.findByIdAndDelete(bookId);

      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Optionally, delete any donations associated with this book
      await Donate.deleteMany({ book: bookId });

      res.json({ message: `Book "${deletedBook.title}" deleted successfully` });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  // Get issue history of a book (who borrowed it)
  async getIssueHistory(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Assuming "borrowHistory" is tracked in the Book model or in a related collection
      const issues = await Donate.find({ book: bookId }).populate("donor", "name email");

      res.json(issues);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
