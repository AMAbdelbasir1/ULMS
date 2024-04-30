# University Learning Management System (ULMS)

The University Learning Management System (ULMS) is a comprehensive platform built with NestJS and GraphQL, designed to facilitate the management of university academic activities. It features a multi-role system that allows for granular control over various functionalities within the university and faculty context.

## Key Features

- **Superadmin Role**

  - Create and manage other superadmin and admin accounts.
  - Add and manage universities and faculties.
  - Assign admins to specific faculties.

- **Admin Role**

  - Manage faculty-specific accounts (doctors, assistants, students).
  - Create and manage courses.
  - Organize semesters and assign courses to them.
  - Enroll doctors, assistants, and students in courses.

- **Doctor Role**

  - Create and manage lectures.
  - Upload and manage lecture files.
  - Create and manage quizzes and tasks.

- **Assistant Role**

  - Assist in course management with restrictions.
  - Upload and manage lab files (cannot edit doctor's content).
  - Create labs and manage lab-specific files.

- **Student Role**

  - Access enrolled courses.
  - Download lecture and lab files.
  - Participate in quizzes and submit tasks.

- **User Account Management**
  - Only superadmins and admins can manage user accounts and edit user information.

## Documentation and Testing

- Access the GraphQL interactive documentation and perform test queries at: `http://localhost:3000/graphql`
- Stream files from the local server:

  - Profile images: `GET /files/image/:imageid`
  - Lecture or lab files: `GET /files/file/:fileId`

- Stream files from the FTP server:
  - FTP profile images: `GET /files/image/ftp/:imageid`
  - FTP files: `GET /files/file/ftp/:fileid`
  - Task files: `GET /files/file/task/:taskid`
  - Task answer files: `GET /files/file/taskanswer/:taskanswerid`

## Getting Started

To get started with the ULMS, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Configure your environment variables as per the `.env` file.
4. Start the server with `npm run start`.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
