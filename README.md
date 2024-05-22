# Blood Donation App API Documentation

Welcome to the Blood Donation App API documentation. This API allows users to register, login, request blood donations, update profiles, and more.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Models](#models)
    - [User Model](#user-model)
    - [Request Model](#request-model)
    - [UserProfile Model](#userprofile-model)
3. [Endpoints](#endpoints)
    - [User Registration](#user-registration)
    - [User Login](#user-login)
    - [Get Donor List](#get-donor-list)
    - [Request A Donor For Blood](#request-a-donor-for-blood)
    - [Get My Donation Requests as Donor](#get-my-donation-requests-as-donor)
    - [Update Request Application Status](#update-request-application-status)
    - [Get My Profile](#get-my-profile)
    - [Update My Profile](#update-my-profile)
4. [Setup](#setup)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **ORM:** Prisma for PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

## Models

### User Model

Fields:
- `id`
- `name`
- `email`
- `password`
- `bloodType`
- `location`
- `availability`
- `createdAt`
- `updatedAt`

### Request Model

Fields:
- `id`
- `donorId`
- `requesterId`
- `phoneNumber`
- `dateOfDonation`
- `hospitalName`
- `hospitalAddress`
- `reason`
- `requestStatus`
- `createdAt`
- `updatedAt`

### UserProfile Model

Fields:
- `id`
- `userId`
- `bio`
- `age`
- `lastDonationDate`
- `createdAt`
- `updatedAt`

## Endpoints

### User Registration

Endpoint: `POST /api/register`

This endpoint handles user registration, creating both the user account and corresponding user profile simultaneously using a transactional approach.

### User Login

Endpoint: `POST /api/login`

### Get Donor List

Endpoint: `GET /api/donor-list`

### Request A Donor For Blood

Endpoint: `POST /api/donation-request`

### Get My Donation Requests as Donor

Endpoint: `GET /api/donation-request`

### Update Request Application Status

Endpoint: `PUT /api/donation-request/:requestId`

### Get My Profile

Endpoint: `GET /api/my-profile`

### Update My Profile

Endpoint: `PUT /api/my-profile`

## Setup

1. Clone the repository. `https://github.com/Porgramming-Hero-web-course/l2-b2-fullstack-track-assignment-8-semon69.git`
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database and configure environment variables.
4. Run migrations: `npx prisma migrate dev`
5. Start the server: `npm run dev`
6. Live Link: `https://blood-donation-servers.vercel.app`

## Usage

1. Register a new user using the `/api/register` endpoint.
2. Log in using the `/api/login` endpoint to obtain a JWT token.
3. Use the obtained token to access other authenticated endpoints.
4. Explore and use the various endpoints as per your requirements.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow (fork, branch, PR) when contributing to this project.

## License

This project is licensed under the [MIT License](LICENSE).
