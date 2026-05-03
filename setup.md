# CrisisChain Setup Guide

Welcome to **CrisisChain**! Follow these instructions to set up your local development environment for both the frontend (React/Vite) and the backend (Node.js/Express with MySQL).

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL** (Local server or remote database)
- **Git**

---

## 1. Database Setup
1. Open your MySQL client or terminal and create the database:
   ```sql
   CREATE DATABASE crisischain_db;
   ```
2. Navigate to the `server` directory and import the database schema to build the tables:
   ```bash
   cd server
   mysql -u your_username -p crisischain_db < schema.sql
   ```

## 2. Backend Configuration
1. Still inside the `server` directory, install the backend dependencies:
   ```bash
   npm install
   ```
2. Create or modify the `.env` file in the `server` folder to include your MySQL credentials and a secure JWT secret:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=crisischain_db
   PORT=5001
   JWT_SECRET=supersecretkey_change_me
   ```

## 3. Seeding Dummy Data (Optional but Recommended)
To populate the `incident` tables with dummy map coordinates and data, you can run the provided seeding script:
```bash
# Ensure you are inside the 'server' directory
node seedDummyIncidents.js
```
*Note: You can run this script at any time to reset and restock your dummy data.*

## 4. Frontend Configuration
1. Open a **new terminal window** and navigate to the project root directory (`crisischain/`).
2. Install the React frontend dependencies:
   ```bash
   npm install
   ```

---

## 5. Running the Application

You will need to run the client and the server simultaneously in two separate terminal windows.

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*(The backend should start on port 5001 and confirm a successful MySQL connection.)*

**Terminal 2 (Frontend Client):**
```bash
# In the project root directory
npm run dev
```
*(The frontend will start on a Vite localhost port, typically `http://localhost:5173`.)*

## Admin Access
The SQL schema already creates a dummy administrative user for testing the admin portal:
- **Role**: Admin
- **Aadhar / Username**: `000000000000` 
- **Password**: `admin123`
