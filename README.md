# 🎬 MovieMint

MovieMint is a modern, full-stack web application built with the MERN stack. It offers a comprehensive platform for managing and exploring movies, featuring secure user authentication, seamless payments, and a responsive, beautiful UI.

## ✨ Features

- **User Authentication:** Secure login and registration powered by [Clerk](https://clerk.com/).
- **Modern UI:** Built with React 19, Tailwind CSS, and Lucide React icons for a stunning user experience.
- **Media Management:** Upload and manage movie posters and videos using [Cloudinary](https://cloudinary.com/).
- **Payments:** Integrated with [Stripe](https://stripe.com/) for subscriptions or pay-per-view access.
- **Background Jobs:** Handled reliably via [Inngest](https://www.inngest.com/).
- **Admin Dashboard:** A dedicated dashboard for administrators to manage movies, users, and releases.
- **Responsive Design:** Fully responsive layout that works flawlessly on desktop, tablet, and mobile.

## 📸 Screenshots

### Home Page
![Home](./screenshots/home.png)

### Movies
![Movies](./screenshots/movies.png)

### New Releases
![Releases](./screenshots/releases.png)

### Admin Dashboard
![Dashboard](./screenshots/dashboard.png)

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Media Player:** React Player
- **Authentication:** @clerk/clerk-react

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** @clerk/express, Svix (Webhooks)
- **Payments:** Stripe
- **Media Storage:** Cloudinary
- **Emails:** Nodemailer
- **Background Jobs:** Inngest

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas)
- Accounts for Clerk, Stripe, Cloudinary, and Inngest

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd MovieMint
```

### 2. Install Dependencies

**For Backend:**
```bash
cd server
npm install
```

**For Frontend:**
```bash
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in both the `client` and `server` directories and add the necessary environment variables.

**`server/.env` example:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**`client/.env` example:**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

*(Note: Adjust the variables based on the actual requirements of the project).*

### 4. Run the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application should now be running on `http://localhost:5173` and the server on `http://localhost:5000`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the ISC License.
