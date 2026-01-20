# University Learning Management System (ULMS)

[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-yellow.svg)](https://opensource.org/licenses/UNLICENSED)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)

The University Learning Management System (ULMS) is a comprehensive, scalable platform built with NestJS and GraphQL, designed to streamline university academic activities. It provides a multi-role architecture enabling granular access control for superadmins, admins, doctors, assistants, and students, facilitating efficient management of courses, lectures, quizzes, tasks, and user enrollments.

## Features

### Role-Based Access Control

- **Superadmin**: Manage superadmin and admin accounts, universities, faculties, and admin assignments.
- **Admin**: Handle faculty-specific user accounts, course creation, semester organization, and user enrollments.
- **Doctor**: Create and manage lectures, upload lecture files, and develop quizzes and tasks.
- **Assistant**: Support course management with restricted editing capabilities, manage lab files, and create labs.
- **Student**: Access enrolled courses, download resources, participate in quizzes, and submit tasks.

### Core Functionality

- **User Management**: Secure account creation, authentication, and role assignment.
- **Course Management**: Comprehensive course creation, enrollment, and organization by semesters.
- **Content Delivery**: Lecture and lab file uploads, streaming, and management (local and FTP support).
- **Assessment Tools**: Quiz creation, task assignments, and submission handling.
- **File Handling**: Support for profile images, lecture files, and task submissions with FTP integration.

### Technical Highlights

- **GraphQL API**: Efficient, flexible queries with Apollo Server integration.
- **Database**: Microsoft SQL Server for robust data management.
- **Authentication**: JWT-based secure authentication with Passport.js.
- **File Uploads**: GraphQL multipart uploads with size and count limits.
- **Validation**: Joi-based input validation for data integrity.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Microsoft SQL Server
- (Optional) Docker and Docker Compose for containerized deployment

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/ulms.git
   cd ulms
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:

   ```env
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   DB_POOL_MAX=10
   DB_POOL_MIN=0
   JWT_SECRET=your-jwt-secret
   # Add other required environment variables as needed
   ```

4. **Database Setup**
   Ensure your Microsoft SQL Server is running and the database is created. The application will handle table creation via the provided scripts or migrations.

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start on `http://localhost:3000`.

### Production Mode

```bash
npm run build
npm run start:prod
```

### Using Docker

```bash
docker-compose up -d
```

## API Documentation

- **GraphQL Playground**: Access interactive documentation at `http://localhost:3000/graphql`
- **Live Demo**: Explore the API at `https://universal-michaelina-one4zero.koyeb.app/graphql`

### Test Credentials

- **Username**: superadmin@gmail.com
- **Password**: Sup3r@dmin

## File Streaming Endpoints

### Local Server Files

- Profile Images: `GET /files/image/:imageId`
- Lecture/Lab Files: `GET /files/file/:fileId`

### FTP Server Files

- FTP Profile Images: `GET /files/image/ftp/:imageId`
- FTP Files: `GET /files/file/ftp/:fileId`
- Task Files: `GET /files/file/task/:taskId`
- Task Answer Files: `GET /files/file/taskanswer/:taskAnswerId`

## Testing

```bash
# Unit Tests
npm run test

# End-to-End Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## Project Structure

```
src/
├── app.module.ts          # Main application module
├── main.ts                # Application entry point
├── auth/                  # Authentication module
├── database/              # Database configuration and services
├── user/                  # User management
├── university/            # University management
├── faculty/               # Faculty management
├── department/            # Department management
├── course/                # Course management
├── semester/              # Semester management
├── lecture/               # Lecture management
├── quiz/                  # Quiz management
├── task/                  # Task management
├── files/                 # File handling services
└── ...                    # Additional modules
```

## Technologies Used

- **Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **Database**: Microsoft SQL Server
- **Authentication**: JWT with Passport.js
- **Validation**: Joi
- **File Uploads**: GraphQL Upload
- **Testing**: Jest
- **Linting**: ESLint with Prettier

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
