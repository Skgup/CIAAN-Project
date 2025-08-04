# 🌐 MiniLinkedIn - Full Stack Social Network

A **LinkedIn-like** social networking platform built with **React (Vite) + TailwindCSS** on the frontend and **Node.js + Express + MongoDB (Atlas)** on the backend.  
Includes features like **profile management**, **image uploads (Cloudinary)**, **posts with likes & comments**, and a **modern LinkedIn-style UI**.

---

## 🚀 **Features**
- ✅ User Authentication (JWT-based login/register)
- ✅ Profile Management (Edit Bio, Headline, Skills, Experience, Education)
- ✅ Profile & Cover Image Upload (Cloudinary Integration)
- ✅ LinkedIn-style UI with TailwindCSS
- ✅ Feed with Posts (Like, Comment in real-time)
- ✅ Responsive Navbar & Profile Page

---

## 📂 **Folder Structure**
project-root/
│
├── backend/                
│   ├── src/
│   │   ├── config/         # MongoDB, Cloudinary configs
│   │   ├── controllers/    # Auth, Post, Upload controllers
│   │   ├── middleware/     # Auth & Upload middleware
│   │   ├── models/         # Mongoose models (User, Post)
│   │   ├── routes/         # Express routes
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env                # Backend env variables
│
├── frontend/               
│   ├── src/
│   │   ├── api/            # Axios API functions
│   │   ├── components/     # Navbar, PostCard, etc.
│   │   ├── pages/          # Profile.jsx, Feed.jsx, Login.jsx, Register.jsx
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── .env                # Frontend env variables
│
└── README.md               # Project documentation


## ⚙️ **Setup Instructions**

### 🔹 **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/minilinkedin.git
cd minilinkedin

cd backend
npm install

##environment variable

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/CIAANcommunity
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:5173

##backend start

npm start


 3. Setup Frontend

cd ../frontend
npm install

##env

VITE_API_BASE_URL=http://localhost:5000/api


###frontend start 

npm run dev

🔗 API Endpoints
Auth
POST /api/auth/register → Register new user

POST /api/auth/login → Login & receive JWT

GET /api/auth/me → Get logged-in user profile

PUT /api/auth/me → Update profile

Upload
POST /api/upload/profile → Upload profile picture

POST /api/upload/cover → Upload cover image

Posts
GET /api/posts → Get all posts

POST /api/posts → Create a new post

PUT /api/posts/:id/like → Like/Unlike a post

POST /api/posts/:id/comment → Add a comment


🛠️ Tech Stack
Frontend: React (Vite) + TailwindCSS + Axios

Backend: Node.js + Express

Database: MongoDB Atlas

File Storage: Cloudinary

Auth: JWT