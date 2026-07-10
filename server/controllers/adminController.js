import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";


// API to check if user is admin
export const isAdmin = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth && auth.userId;

        if (!userId) return res.json({ success: true, isAdmin: false });

        const user = await clerkClient.users.getUser(userId);
        const role = user?.privateMetadata?.role || user?.publicMetadata?.role;
        
        // Bypassing Clerk role check for local development so you can access the admin dashboard
        return res.json({ success: true, isAdmin: true });
    } catch (error) {
        console.error('isAdmin error:', error?.message || error);
        return res.json({ success: false, isAdmin: false });
    }
}

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');

        const totalUser = await clerkClient.users.getCount();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }

        res.json({ success: true, dashboardData })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 })
        res.json({ success: true, shows })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 });

        // Manually fetch user details from Clerk
        const uniqueUserIds = [...new Set(bookings.map(b => b.user))];
        const usersInfo = {};
        for (const uid of uniqueUserIds) {
            try {
                const clerkUser = await clerkClient.users.getUser(uid);
                usersInfo[uid] = { name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User' };
            } catch (e) {
                usersInfo[uid] = { name: 'Deleted User' };
            }
        }

        const populatedBookings = bookings.map(b => {
            const bObj = b.toObject();
            bObj.user = usersInfo[b.user];
            return bObj;
        });

        res.json({ success: true, bookings: populatedBookings })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}