<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS logo" />
  </a>
</p>

# Teslo Shop API

REST API for managing an online store's product catalog, built with NestJS, PostgreSQL, and TypeORM.

The project includes JWT authentication, role-based authorization, product management, image uploads, pagination, and database seeding.

## About this project

This project was developed by following Fernando Herrera's course **"Nest: Desarrollo backend escalable con Node"**.

It is intended as a practical learning project for building scalable back-end applications with NestJS and its ecosystem.

## Tech stack

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- Passport and JWT
- Docker Compose
- Jest

## Implemented features

- User registration and login
- JWT-based authentication
- Role-based authorization with `user`, `admin`, and `super-user` roles
- Product CRUD operations
- Product lookup by UUID, slug, or title
- Pagination with `limit` and `offset`
- Multiple images per product
- Image upload and static file serving
- Global request validation
- Seed data for the product catalog

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Docker and Docker Compose

## Installation

1. Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd 04-teslo-shop
```

2. Install the dependencies:

```bash
npm install
```

3. Create the environment file from the provided template:

```bash
cp .env.template .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.template .env
```

4. Review and update the values in `.env`:

```env
DB_PASSWORD=123456
DB_NAME=teslodb
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres

PORT=3001
HOST_API=http://localhost:3001/api

JWT_SECRET=your-secure-jwt-secret
```

> Use a strong `JWT_SECRET` and secure database credentials outside local development. Do not commit real secrets to the repository.

## Database

Start PostgreSQL with Docker Compose:

```bash
docker compose up -d
```

The database is exposed locally on port `5433`. Its data is persisted in the `postgres/` directory.

## Running the application

Start the API in development mode with automatic reload:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3001/api
```

For a production build:

```bash
npm run build
npm run start:prod
```

## Authentication

### Register a user

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "Password1",
  "fullName": "Example User"
}
```

### Log in

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "Password1"
}
```

Both endpoints return a JWT. Send it in the `Authorization` header when accessing protected routes:

```http
Authorization: Bearer <token>
```

## Main endpoints

### Products

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/products` | List products | Public |
| `GET` | `/api/products/:term` | Find a product by UUID, slug, or title | Public |
| `POST` | `/api/products` | Create a product | Authenticated user |
| `PATCH` | `/api/products/:id` | Update a product | Authenticated user |
| `DELETE` | `/api/products/:id` | Delete a product | Admin |

The product list supports pagination:

```http
GET /api/products?limit=10&offset=0
```

### Authentication and authorization

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user | Public |
| `POST` | `/api/auth/login` | Log in | Public |
| `GET` | `/api/auth/private` | Test JWT authentication | Authenticated user |
| `GET` | `/api/auth/private2` | Test role-based authorization | Admin or super-user |
| `GET` | `/api/auth/private3` | Test the custom authentication decorator | Authenticated user |

### Files

Upload a product image as `multipart/form-data`, using `file` as the field name:

```http
POST /api/files/product
```

Retrieve an uploaded product image with:

```http
GET /api/files/product/:imageName
```

### Seed data

```http
GET /api/seed
Authorization: Bearer <admin-token>
```

The seed operation deletes the existing products and loads the initial catalog.


## Request validation

The application uses a global NestJS `ValidationPipe`. It:

- Removes properties that are not declared in the DTOs.
- Rejects requests containing unknown properties.
- Validates field types, formats, and constraints.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start development mode with automatic reload |
| `npm run build` | Compile the application |
| `npm run start:prod` | Run the compiled application |
| `npm run lint` | Run ESLint and apply fixes |
| `npm run format` | Format source and test files with Prettier |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate a test coverage report |

## Project structure

```text
src/
|-- auth/       # Users, JWT, guards, roles, and decorators
|-- common/     # Shared DTOs and modules
|-- files/      # Image upload and delivery
|-- products/   # Products and associated images
|-- seed/       # Initial catalog data
|-- app.module.ts
`-- main.ts
```

## License

This project is unlicensed and is intended for educational purposes.
