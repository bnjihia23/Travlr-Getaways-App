# Travlr Getaways - Full Stack Travel Booking Platform

## Overview

Travlr Getaways is a full-stack travel management application that provides users with a web and mobile experience for browsing and managing travel packages. The system includes a RESTful backend API, a database-driven web application, an administrative dashboard, and a React Native mobile companion application.

The project demonstrates full-stack application development, API integration, database design, authentication, and cross-platform software engineering principles.

## Technologies Used

### Frontend
- Angular
- React Native
- Expo
- HTML
- CSS
- TypeScript

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Passport.js

### Database
- MongoDB
- Mongoose
- NoSQL Data Modeling

### Tools
- Git/GitHub
- NPM
- Postman
- Android/iOS Mobile Testing with Expo Go


## Features

### Web Application

- Dynamic travel package listings
- Responsive user interface
- Client-side routing
- Integration with backend API services

### Admin Dashboard

- Secure administrator authentication
- JWT-based access control
- Create, update, and manage trip data
- Protected API communication

### Mobile Application

- Cross-platform mobile experience using React Native
- Trip listings retrieved from Express backend API
- Detailed trip information screens
- User login and registration
- Persistent authentication using AsyncStorage
- Favorites stored locally on device
- Real-time search functionality
- Bottom tab and stack navigation


## System Architecture

The application follows a three-tier architecture:

```
Frontend Applications
(Angular Web App + React Native Mobile App)

            ↓

REST API Layer
(Node.js + Express)

            ↓

Database Layer
(MongoDB)
```

The frontend applications communicate with the Express backend through RESTful API endpoints. The backend handles authentication, business logic, and database operations.


## Project Structure

```
Travlr-Getaways-App

│
├── travlr/
│   ├── Express backend API
│   ├── Angular web application
│   ├── Admin dashboard
│   └── MongoDB integration
│
└── travlr-mobile/
    ├── React Native components
    ├── Navigation
    ├── Authentication
    └── API services
```


## Installation and Setup

### Requirements

Install:

- Node.js v16+
- NPM
- MongoDB (local installation or MongoDB Atlas)
- Expo Go mobile application


## Backend Setup

Navigate into the backend project:

```bash
cd travlr
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The Express API will run locally:

```text
http://localhost:3000
```


## Angular Web Application

Navigate to the Angular application:

```bash
cd travlr/app_admin
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm start
```

Application:

```text
http://localhost:4200
```


## Admin Login

Default development credentials:

```
Username: admin
Password: admin
```


## Mobile Application Setup

Navigate into the mobile project:

```bash
cd travlr-mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Scan the generated QR code using the Expo Go mobile app.


## Skills Demonstrated

- Full-stack application architecture
- REST API design and integration
- Database modeling with MongoDB
- CRUD operations
- User authentication and authorization
- Mobile application development
- State management
- Debugging and testing
- Secure application design principles


## Future Improvements

Potential future enhancements include:

- Cloud deployment using AWS or Azure
- CI/CD pipeline integration
- Automated testing
- Payment processing functionality
- Advanced search and filtering
- Expanded user profile management
