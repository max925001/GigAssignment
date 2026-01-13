# 🚀 GiGFree - Premium Freelance Marketplace

GiGFree is a modern, high-performance freelance marketplace built with the MERN stack. It features a premium, glassmorphic UI, real-time notifications via Socket.io, and industry-standard security using HttpOnly cookies.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://gig-assignment-hbzk.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo-Video-red?style=for-the-badge)](https://YOUR_VIDEO_LINK)

---

## ✨ Core Features

### 🔐 Secure Authentication
- **HttpOnly Cookies**: JWT-based session management that is immune to XSS attacks.
- **Server-Side Validation**: Automatic session recovery on page refresh.
- **Protected Routes**: Middleware that ensures only authorized users can access sensitive features.

### 💼 Gig Management
- **Post a Gig**: Clients can easily list projects with detailed descriptions and budgets.
- **Smart Bidding**: Freelancers can submit bids. Double-bidding is prevented, and freelancers can track their own application status.
- **Real-time Filtering**: The "Latest Gigs" grid automatically hides projects you've already applied for.

### 🔔 Real-time Notifications
- **Instant Updates**: Powered by **Socket.io**. Get notified immediately when someone bids on your gig.
- **Mobile-Friendly Center**: A polished notification panel optimized for both desktop and mobile layouts.

### 📱 Responsive Design
- **Premium UI**: Dark-mode, glassmorphic design inspired by VectorShift.
- **Mobile Navigation**: A specialized fixed bottom navigation bar for a native app feel on mobile/tablet.
- **Footer**: A modern, link-rich footer integrated across all pages.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Redux Toolkit, Vite, Tailwind CSS (v4), Lucide Icons.
- **Backend**: Node.js, Express, Mongoose, Socket.io.
- **Database**: MongoDB Atlas.
- **Security**: JWT, bcryptjs, cookie-parser.
- **Deployment**: Vercel.

---

## 💻 Local Setup Guide

Follow these steps to get the project running on your machine:

### 1. Prerequisite
Ensure you have **Node.js** and **npm** installed.

### 2. Clone the Project
```bash
git clone https://github.com/YOUR_USERNAME/GiGFree.git
cd GiGFree
```

### 3. Server Configuration
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder (use `.env.example` as a template):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend:
```bash
npm run dev
```

### 4. Client Configuration
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` folder:
```env
VITE_API_BASE_URL=/api
```
Start the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🚀 Deployment

The project is pre-configured for **Vercel**.

1.  **Backend**: Set the root directory to `server`. Include `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` (frontend URL) as env variables.
2.  **Frontend**: Set the root directory to `client`. Add `VITE_API_BASE_URL` (backend URL) as an env variable.

---

## 🤝 Contributing
Feel free to fork this project and submit PRs. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
