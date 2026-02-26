# Bug Tracker Application - Complete Guide for Beginners

## What is a Bug Tracker?

Before diving into the technical details, let's understand what a Bug Tracker is. Imagine you're working on a software project with a team. When someone finds a problem (called a "bug") in the software, they need a way to:

- Report the bug
- Track who is working on fixing it
- See the current status (Is it fixed? Is someone working on it?)
- Prioritize which bugs are most important

That's exactly what our Bug Tracker application does! It's like a digital task manager specifically designed for tracking software problems.

---

## Overall Architecture - How the Application Works

Think of this application like a restaurant:

1. **Frontend (The Waiter)** - This is what you see in your browser. It takes your orders (actions like creating a ticket) and shows you what's happening (displays projects, tickets, charts).

2. **Backend (The Kitchen)** - This is where all the processing happens. When the waiter (frontend) sends an order to the kitchen (backend), it prepares the food (processes data) and sends it back.

3. **Database (The Pantry)** - This is where all the ingredients (data) are stored. Just like a restaurant keeps its ingredients in the pantry, the application keeps all its data in the database.

---

## Technology Stack - What Tools We Used

### Frontend (What you see in the browser)

1. **React** - Think of React like a building block system. Instead of writing everything from scratch, we use pre-made components (like LEGO blocks) that we can combine to create the user interface. It's like using pre-cut pieces to build a house.

2. **Vite** - This is a tool that helps develop React applications faster. It's like having a super-fast construction crew that builds your project quickly and automatically refreshes when you make changes.

3. **Tailwind CSS** - This is a styling framework that makes websites look beautiful. Instead of writing custom CSS for every element, Tailwind gives us pre-designed classes (like "background-color: purple" becomes just "bg-purple-500"). It's like having a wardrobe full of pre-matched outfits.

4. **React Router** - This allows users to navigate between different pages in the application. It's like having different doors in a building that take you to different rooms.

5. **Axios** - This is a tool that helps the frontend talk to the backend. It's like a messenger that delivers your orders to the kitchen and brings back the results.

6. **Recharts** - This is a charting library that creates beautiful charts and graphs. We used this to show ticket statistics.

7. **Hello Pangea DnD** - This is a library that enables "drag and drop" functionality, allowing you to move tickets between different status columns (like moving a sticky note from one column to another).

### Backend (The server side)

1. **Node.js** - This is JavaScript running on the server. It's like the engine that powers the backend. Originally JavaScript was only for browsers, but Node.js allows it to run on servers too.

2. **Express** - This is a framework that makes building APIs easier. It's like a template or skeleton that gives us a structure to work with.

3. **MongoDB** - This is our database - where all data is stored. It's different from traditional databases (like SQL) because it stores data in a flexible, JSON-like format. Think of it as a flexible filing cabinet where you can store any type of document.

4. **Mongoose** - This is a tool that helps us interact with MongoDB. It provides a way to define data models and perform database operations easily.

5. **JWT (JSON Web Tokens)** - This is used for authentication. When you log in, the server gives you a special token that proves who you are. It's like getting an ID card that you show to access protected areas.

6. **Bcrypt** - This is a security tool that encrypts passwords. We never store actual passwords - only encrypted versions, so even if someone hacks the database, they can't read the passwords.

7. **CORS** - This is a security feature that controls which websites can access our API.

---

## Project Structure - Where Everything Is

```
Bug Tracker/
├── backend/                    # The Server Side
│   ├── config/
│   │   └── db.js             # Database connection
│   ├── controllers/           # Business logic (the "brains")
│   │   ├── authController.js # Handling login/register
│   │   ├── commentController.js # Managing comments
│   │   ├── projectController.js # Managing projects
│   │   └── ticketController.js  # Managing tickets
│   ├── middleware/
│   │   └── auth.js           # Security checks (are you logged in?)
│   ├── models/               # Data definitions
│   │   ├── Comment.js        # What a comment looks like
│   │   ├── Project.js        # What a project looks like
│   │   ├── Ticket.js         # What a ticket looks like
│   │   └── User.js           # What a user looks like
│   ├── routes/               # API endpoints (URLs)
│   │   ├── auth.js           # /api/auth/* routes
│   │   ├── comments.js       # /api/comments/* routes
│   │   ├── projects.js      # /api/projects/* routes
│   │   └── tickets.js       # /api/tickets/* routes
│   ├── .env                  # Secret configuration
│   ├── server.js             # Entry point (starts the server)
│   └── package.json          # Dependencies list
│
└── frontend/                  # The User Interface
    ├── public/
    │   └── vite.svg          # Logo
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx    # Navigation bar
    │   ├── context/
    │   │   ├── AuthContext.jsx   # User login state
    │   │   └── TicketContext.jsx  # Ticket/project state
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Projects list page
    │   │   ├── Login.jsx         # Login page
    │   │   ├── ProjectDetail.jsx # Tickets kanban board
    │   │   └── Register.jsx      # Registration page
    │   ├── services/
    │   │   └── api.js        # API communication
    │   ├── App.jsx           # Main app component
    │   ├── index.css         # Global styles
    │   └── main.jsx          # Entry point
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Database - Where Data is Stored

### What is MongoDB?

MongoDB is like a big digital filing cabinet. Instead of the traditional way of organizing data in strict tables (like Excel), MongoDB stores data as "documents" - which are very similar to JavaScript objects.

### Our Database Collections

1. **Users Collection** - Stores user information

```
json
   {
     "_id": "unique id",
     "name": "John Doe",
     "email": "john@example.com",
     "password": "encrypted password"
   }

```

2. **Projects Collection** - Stores projects

```
json
   {
     "_id": "unique id",
     "name": "Website Redesign",
     "description": "Redesigning the company website",
     "key": "WEB",
     "owner": "user_id",
     "members": ["user_id1", "user_id2"]
   }

```

3. **Tickets Collection** - Stores bugs/features/tasks

```
json
   {
     "_id": "unique id",
     "title": "Login button not working",
     "description": "When clicking login, nothing happens",
     "status": "To Do",  // or "In Progress", "Done"
     "priority": "High",  // or "Critical", "Medium", "Low"
     "type": "Bug",       // or "Feature", "Task", "Improvement"
     "project": "project_id",
     "assignee": "user_id",
     "ticketKey": "WEB-1"  // Like "PROJECT_NUMBER"
   }

```

4. **Comments Collection** - Stores comments on tickets

```
json
   {
     "_id": "unique id",
     "text": "I think this is related to the API",
     "ticket": "ticket_id",
     "user": "user_id"
   }

```

---

## How Data Flows Through the Application

### Example: Creating a New Ticket

1. **User Action**: You fill out the "Create Ticket" form on the Project Detail page and click "Create"

2. **Frontend Processing**:
   - The React component collects the form data
   - It uses Axios to send a POST request to the backend
   - The request looks like: `POST /api/tickets` with the ticket data

3. **Backend Processing**:
   - Express receives the request
   - The auth middleware checks if you're logged in
   - The ticketController processes the data
   - Mongoose creates a new document in MongoDB

4. **Response**:
   - MongoDB confirms the save
   - The backend sends back the created ticket
   - React updates the screen to show the new ticket

---

## API Endpoints - How Frontend Talks to Backend

### Authentication Routes

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| POST   | /api/auth/register | Create a new account          |
| POST   | /api/auth/login    | Login and get a token         |
| GET    | /api/auth/me       | Get current user info         |
| GET    | /api/auth/users    | Get all users (for assigning) |

### Project Routes

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | /api/projects     | Get all projects     |
| POST   | /api/projects     | Create a new project |
| GET    | /api/projects/:id | Get one project      |
| PUT    | /api/projects/:id | Update a project     |
| DELETE | /api/projects/:id | Delete a project     |

### Ticket Routes

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | /api/tickets/project/:id | Get tickets for a project |
| POST   | /api/tickets             | Create a new ticket       |
| GET    | /api/tickets/:id         | Get one ticket            |
| PUT    | /api/tickets/:id         | Update a ticket           |
| DELETE | /api/tickets/:id         | Delete a ticket           |
| PATCH  | /api/tickets/:id/status  | Update ticket status      |

### Comment Routes

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | /api/comments/ticket/:id | Get comments for a ticket |
| POST   | /api/comments            | Add a comment             |

---

## Running the Application

### Prerequisites Needed

1. **Node.js** - Download from nodejs.org (version 14 or higher)
2. **MongoDB** - Either:
   - Install locally from mongodb.com
   - Use MongoDB Atlas (cloud version)

### Starting the Application

**Step 1: Start MongoDB**

- If using local MongoDB, make sure the service is running
- If using Atlas, you already have it running in the cloud

**Step 2: Start Backend**

```
bash
cd backend
npm start
```

This starts the server on http://localhost:5000

**Step 3: Start Frontend**

```
bash
cd frontend
npm run dev
```

This starts the website on http://localhost:3000 (or 3001 if 3000 is busy)

---

## Features We Added

### Original Features

1. User Registration and Login
2. Create/View Projects
3. Create/View Tickets in Kanban Board
4. Drag and Drop tickets between columns
5. Filter tickets by status, priority, assignee
6. Search tickets

### New Features Added

1. **Dashboard:**
   - Delete projects (with confirmation)
   - Pie charts showing ticket status distribution
   - Pie charts showing ticket priority distribution
   - Custom styled buttons with icons

2. **Project Detail:**
   - View/Hide charts toggle
   - Status distribution pie chart
   - Priority distribution pie chart
   - Type distribution bar chart
   - Tickets by assignee bar chart
   - Delete tickets (with confirmation)
   - Edit tickets
   - Custom styled filter dropdowns
   - Styled search input

---

## Security Features

1. **Password Encryption** - Passwords are never stored in plain text
2. **JWT Authentication** - Secure token-based login
3. **Protected Routes** - Only logged-in users can access the app
4. **CORS Protection** - Controls who can access the API

---

## Summary for Newbies

Think of this project as a digital task board (like a physical Kanban board with sticky notes), but with superpowers:

- **Multiple boards** (Projects)
- **Color-coded sticky notes** (Priority: Critical=Red, High=Orange, Medium=Yellow, Low=Green)
- **Different types of notes** (Bug 🐛, Feature ✨, Task 📋, Improvement ⬆️)
- **Automatic tracking** (Who assigned to what, status changes)
- **Beautiful charts** (See the big picture at a glance)
- **Team collaboration** (Multiple users can work together)

The application is built using modern web technologies that separate the user interface (React) from the server logic (Node.js/Express), with MongoDB storing all the data. This separation (called "full-stack development") is a very popular and industry-standard approach for building web applications.

---

## Quick Reference Card

| Term     | Meaning                                         |
| -------- | ----------------------------------------------- |
| Frontend | What you see and interact with in the browser   |
| Backend  | Server-side processing and business logic       |
| Database | Where all data is permanently stored            |
| API      | The "language" frontend and backend use to talk |
| JWT      | A secure token that proves who you are          |
| MongoDB  | A document-based database                       |
| React    | A JavaScript library for building UIs           |
| Express  | A Node.js framework for building APIs           |
| Kanban   | A visual board for tracking tasks               |

---

_Last Updated: 2026_
_Built with ❤️ using React, Node.js, Express, and MongoDB_
