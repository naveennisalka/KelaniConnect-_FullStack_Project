# KelaniConnect (Kelani Media) 🎓

A full-stack university social networking, career portal, and student engagement web platform built for the University of Kelaniya community.

---

## ✨ Key Features

- **Authentication & Authorization:** Secure user registration and login powered by Spring Security and JWT (JSON Web Tokens) with protected frontend routes.
- **Social Feed & Posts:** Create, view, and interact with campus posts on the Home feed and a 3-column profile post grid.
- **Student Networking:** Discover peers (`FindFriendCard`), manage incoming/outgoing friend requests (`FriendRequestCard`), and view profile statistics (`ProfileStatsCard`).
- **Jobs & Opportunities Portal:** Browse and post internship/job listings with an interactive job posting modal (`JobsPage`).
- **Events & Campus Info:** Stay updated with university events, announcements, and student activities.
- **Responsive UI:** Clean, modern interface styled with Bootstrap 5 and custom modular components.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Bootstrap 5.3.8, Custom CSS
- **Routing & State:** React Router, React Context API (`AuthContext`)
- **HTTP Client:** Fetch / Axios

### Backend
- **Framework:** Spring Boot (Java 21)
- **Security:** Spring Security, JJWT (`0.12.6`)
- **Database:** MongoDB Atlas (Spring Data MongoDB)
- **Environment Management:** Custom `DotenvLoader`

---

## 📂 Project Structure

```text
KelaniConnect-_FullStack_Project/
└── kelani-media/
    ├── backend/                  # Spring Boot REST API
    │   ├── src/main/java/com/example/kelani_media/
    │   │   ├── config/           # MongoConfig, DotenvLoader, Security/CORS config
    │   │   ├── controller/       # REST Controllers
    │   │   ├── model/            # MongoDB Document Models
    │   │   ├── repository/       # Spring Data MongoDB Repositories
    │   │   ├── security/         # JwtTokenProvider, JwtAuthenticationFilter
    │   │   └── service/          # Business Logic
    │   └── .env.example          # Backend environment template
    │
    └── frontend/                 # React + Vite Client Application
        ├── src/
        │   ├── components/       # Sidebar, ProtectedRoute, Friend/Profile Cards
        │   ├── context/          # AuthContext
        │   └── pages/            # Home, Login, Signup, ProfilePage, JobsPage, FriendsPage
        └── .env.example          # Frontend environment template
```

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK):** Version 21 or higher
- **Node.js & npm:** Version 18+ recommended
- **Database:** A MongoDB Atlas cluster or local MongoDB instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/naveennisalka/KelaniConnect-_FullStack_Project.git
cd KelaniConnect-_FullStack_Project
```

---

### 2. Backend Setup (`kelani-media/backend`)

1. Navigate to the backend directory:
   ```bash
   cd kelani-media/backend
   ```

2. Create a `.env` file in `kelani-media/backend/` (you can copy `.env.example`) and configure your environment variables:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kelaniMedia?retryWrites=true&w=majority
   MONGODB_DATABASE=kelaniMedia
   JWT_SECRET=YourSuperSecretKeyAtLeast32CharactersLongForHS256Security
   JWT_EXPIRATION=86400000
   ```
   > **Note:** Ensure `JWT_SECRET` is at least 32 characters (256 bits) long to satisfy HMAC-SHA256 key requirements.

3. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Or run `KelaniMediaApplication.java` directly from your IDE.)*

   The backend server will start on **`http://localhost:8080`**.

---

### 3. Frontend Setup (`kelani-media/frontend`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd kelani-media/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `kelani-media/frontend/` (you can copy `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at **`http://localhost:5173`**.

---

## 📄 License

This project is developed for academic and student community purposes at the **University of Kelaniya**.
