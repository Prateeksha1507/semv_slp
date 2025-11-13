import DonationRequest from "../models/DonationRequest.js";
import Book from "../models/Book.js";
import Donate from "../models/Donate.js";
import Member from "../models/Member.js";

export const donationRequestController = {
    // Fetch all pending/approved/rejected donation requests
    async getAllDonationRequests(req, res) {
        try {
            // Fetch all donation requests
            const donationRequests = await DonationRequest.find()
                .populate("donor", "name email")
                .sort({ createdAt: -1 });

            // Manually fetch book data and attach it to the donation requests
            const donationRequestsWithBook = await Promise.all(
                donationRequests.map(async (request) => {
                    const book = await Book.findOne({
                        title: request.title,
                        author: request.author,
                    });

                    // Attach book data to the request object
                    request.book = book; // Add the book details to the request object

                    return request;
                })
            );

            res.json(donationRequestsWithBook); // Return the updated donation requests with book data
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    async updateDonationRequest(req, res) {
        try {
            const { status, id } = req.params;

            if (!["approved", "rejected"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const request = await DonationRequest.findById(id).populate("donor");

            if (!request) {
                return res.status(404).json({ message: "Donation request not found" });
            }

            // Update the donation request status
            request.status = status;
            await request.save();

            // If approved, handle the donation process (e.g., create a new book entry)
            if (status === "approved") {
                const newBook = await Book.create({
                    title: request.title,
                    author: request.author,
                    genres: request.genres,
                    description: request.description,
                    coverImage: request.coverImage || null,
                    donor: request.donor?._id,
                    status: "available",
                });

                await Donate.create({
                    donor: request.donor?._id,
                    book: newBook._id,
                });
            }

            res.status(200).json({
                message: `Donation request ${status} successfully`,
                request, // Return the updated request
            });
        } catch (err) {
            console.error("Error updating donation request:", err);
            res.status(500).json({ message: err.message });
        }
    },
};
