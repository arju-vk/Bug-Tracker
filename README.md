# Bug Tracker Application

A full-stack bug tracking application with React frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Project Structure

```
bug-tracker/
├── backend/           # Express.js API server
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/   # Auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── .env          # Environment variables
│   ├── server.js     # Server entry point
│   └── package.json
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```
bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bug-tracker
# Or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/bug-tracker
JWT_SECRET=your-secret-key-here
```

Start the backend server:

```
bash
npm start
# or
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:

```
bash
cd frontend
npm install
```

Start the frontend development server:

```
bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running the Application

1. **Start MongoDB** - Ensure MongoDB is running (local or cloud)
2. **Start Backend** - `cd backend && npm start` (runs on port 5000)
3. **Start Frontend** - `cd frontend && npm run dev` (runs on port 3000)

Open your browser and navigate to `http://localhost:3000`

## To run the application in the future

**Open a terminal and run:**

`cd "c:/Code/R.W.P/Bug Tracker/backend"`

**Then**

`node server.js`

**Open another terminal and run:**

`cd "c:/Code/R.W.P/Bug Tracker/frontend"`

**then**

`npm run dev`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tickets

- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Comments

- `GET /api/tickets/:ticketId/comments` - Get comments for a ticket
- `POST /api/tickets/:ticketId/comments` - Add comment to ticket

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Database**: MongoDB
  "# Bug-Tracker"
