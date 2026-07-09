import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth && auth.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "not authorized" });
        }

        const user = await clerkClient.users.getUser(userId);

        const role = user?.privateMetadata?.role || user?.publicMetadata?.role;

        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: "not authorized" });
        }

        next();
    } catch (error) {
        console.error('protectAdmin error:', error?.message || error);
        return res.status(500).json({ success: false, message: "not authorized" });
    }
}