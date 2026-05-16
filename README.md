# TeamTaskManager

A full-stack Team Task Management system built using the MERN stack with authentication, role-based access control, employee management, and task assignment.

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Role-based access (Admin / Member)

### Task Management

* Create tasks
* Assign tasks to employees
* View task status
* Project tracking
* Dashboard analytics

### Employee Management

* Add employees
* Update employee details
* Delete employees
* View team members

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Recharts
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT
* bcrypt
* CORS

## Project Structure

```txt
TeamTaskManager/
│
├── client/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── App.jsx
│
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   └── app.js
│
└── README.md
```

## Installation

Clone repository:

```bash
git clone https://github.com/Sanjay6388/TaskManager.git
```

Go into project:

```bash
cd TeamTaskManager
```

### Backend setup

```bash
cd server
npm install
npm run dev
```

Create .env

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

Create .env

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

Frontend:

* Vercel

Backend:

* Railway

Database:

* MongoDB Atlas

## API Examples

Authentication:

```txt
POST /api/register
POST /api/login
```

Tasks:

```txt
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## Security

* bcrypt password hashing
* JWT authentication
* Protected APIs
* Middleware validation
* Environment variables

## Future Improvements

* Real-time notifications using Socket.IO
* Email notifications
* Redis caching
* Docker deployment
* Refresh tokens
* Audit logs

## Author
Hemant Hazra
@SS 2026
