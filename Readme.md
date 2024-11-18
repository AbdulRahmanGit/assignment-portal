

---

# Assignment Submission Portal

**Deployed Link: [Assignment Submission Portal](https://assignment-portal-mu.vercel.app/)**  
Use the above link to explore all functionalities without needing to clone the repository.  

---

## Overview

This project implements a backend system for an **Assignment Submission Portal**, where **Users** can upload assignments, and **Admins** can manage them by accepting or rejecting submissions. The system uses **MongoDB** as its database and provides a modular, scalable structure for handling users, assignments, and admin workflows.

---

## Features

### User Features:
1. **User Registration and Login**
   - Users can register and log in to their accounts securely.
2. **Upload Assignments**
   - Users can upload assignments and tag them to a specific admin.
3. **Fetch Admins**
   - Users can view all registered admins and select one while uploading assignments.

### Admin Features:
1. **Admin Registration and Login**
   - Admins can register and log in to their accounts securely.
2. **View Assignments**
   - Admins can fetch all assignments tagged to them, including:
     - **Username** of the submitter.
     - **Task Description**.
     - **Submission Date and Time**.
3. **Manage Assignments**
   - Admins can accept or reject assignments based on the details provided.

### General Features:
- **Validation**: 
  - Input validation ensures all requests are properly formatted.
  - Meaningful error messages are provided for invalid data.
- **Database**: MongoDB handles persistent storage for users, admins, and assignments.
- **Authentication**: Secure user and admin management.
- **Extensibility**: Modular code structure allows easy updates and scaling.

---

## API Endpoints

### User Endpoints

| Method | Endpoint           | Description                                                                   |
|--------|--------------------|-------------------------------------------------------------------------------|
| POST   | `/register`        | Register a new user                                                          |
| POST   | `/login`           | Log in as a user                                                             |
| POST   | `/upload`          | Upload an assignment                                                         |
| GET    | `/admins`          | Fetch all registered admins                                                  |
| GET    | `/assignments`     | Fetch all assignments previously submitted, including their statuses (My Idea) |

### Admin Endpoints

| Method | Endpoint                      | Description                                   |
|--------|-------------------------------|-----------------------------------------------|
| POST   | `/register`                   | Register a new admin                         |
| POST   | `/login`                      | Log in as an admin                           |
| GET    | `/assignments`               | Fetch assignments tagged to the logged admin |
| POST   | `/assignments/:id/accept`     | Accept a specific assignment                 |
| POST   | `/assignments/:id/reject`     | Reject a specific assignment                 |

**Note:** The `GET /assignments` endpoint allows both users and admins to retrieve previously submitted assignments, including their statuses (e.g., pending, accepted, rejected). This was **my idea** to enhance visibility for all users and admins.

---

## Workflow

1. **Users** register or log in and can view the list of admins using the `/admins` endpoint.
2. They upload assignments tagged to specific admins using the `/upload` endpoint.
3. **Admins** log in to fetch assignments tagged to them using `/assignments`.
4. Admins can then accept or reject assignments using `/assignments/:id/accept` or `/assignments/:id/reject`.

---

## Database Schema

### User Schema

```json
{
    "username": "String",
    "email": "String",
    "password": "String",
   "role": { 
        "type": "String", 
        "enum": ["user", "admin"], 
        "default": "user"
    }
}
```

### Admin Schema

```json
{
    "username": "String",
    "email": "String",
    "password": "String"
}
```

### Assignment Schema

```json
{
    "userId": "String",   // Reference to User ID
    "task": "String",
    "admin": "String",    // Reference to Admin ID
    "status": "String",   // 'Pending', 'Accepted', or 'Rejected'
    "timestamp": "Date"
}
```

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AbdulRahmanGit/assignment-portal.git
   cd assignment-portal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file with the following:
   ```plaintext
   PORT=5000
   MONGO_URI=<Your_MongoDB_URI>
   JWT_SECRET=<Your_Secret_Key>
   ```

4. **Run the Server**:
   ```bash
   npm start
   ```

---

## Deployment

The project has been deployed at **[https://assignment-portal-mu.vercel.app/](https://assignment-portal-mu.vercel.app/)**.  
All features are fully functional and accessible through this link.

---

## Testing the Portal

Use the provided **deployed link** to:
- **Register as a User or Admin**.
- **Submit Assignments** tagged to specific admins.
- **Accept/Reject Submissions** as an admin.
- **Fetch All Assignments** for visibility into previously submitted tasks, their statuses, and associated details.

---

## Future Enhancements
- **OAuth2 Authentication** for improved security.
- **Role-Based Access Control (RBAC)**.
- **Pagination** for better management of large datasets.
- **File Uploads**: Allow actual file submissions instead of JSON payloads.

---

## Contributing

Feel free to contribute to the project by forking the repository and submitting a pull request. For any queries or issues, reach out to the repository maintainer.

---

Enjoy exploring the **Assignment Submission Portal**! 🎉
