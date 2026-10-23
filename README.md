# Glowra API (Server)

REST API for **Glowra**, a skincare marketplace where people explore, buy, sell and review skincare products. Built with Express 5 and MongoDB, with JWT authentication and role-based access for users and admins.

- **Live API:** {{API_URL}} (health check: `{{API_URL}}/api/health`)
- **Live website:** {{SITE_URL}}
- **Client repository:** https://github.com/hamsakib/glowra-client

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| User | user@glowra.dev | User@1234 |
| Admin | admin@glowra.dev | Admin@1234 |

## Features

- JWT authentication with bcrypt password hashing and token expiry
- Role-based middleware (user and admin) protecting write and admin routes
- Products with server-side search, category and price filters, sorting and pagination
- Reviews (only buyers can review), orders with status updates, categories, blog posts
- Contact messages and newsletter subscribers stored in MongoDB
- Image upload (multer + sharp, resized to WebP and stored in MongoDB)
- Dashboard statistics for charts (users, products, orders, revenue over time)
- Input validation with Zod, centralized error handling, proper HTTP status codes
- Security: helmet, CORS allow-list, rate limiting, compression

## Tech stack

Node.js · Express 5 · MongoDB · Mongoose · JSON Web Tokens · bcrypt · Zod · multer · sharp · helmet · express-rate-limit

## Project structure

```
server/
├── index.js          # starts the server (local)
├── app.js            # Express app: middleware, routes, error handling
├── api/index.js      # Vercel serverless entry
├── config/           # env + database connection
├── routes/           # route definitions per resource
├── controllers/      # request handlers
├── middleware/       # auth, roles, validation, upload, errors
├── models/           # Mongoose schemas
└── seed/             # demo data and seed script
```

## API overview

| Base path | Endpoints |
| --- | --- |
| `/api/auth` | `POST /register`, `POST /login`, `GET /me` |
| `/api/products` | list with filters, featured, filters, mine, details by slug, related, create, update, delete, admin list |
| `/api/categories` | list, create, update, delete (admin) |
| `/api/reviews` | top reviews, product reviews, eligibility, create, delete |
| `/api/orders` | create, mine, all (admin), details, cancel, update status |
| `/api/users` | profile, preferences, password, admin user management |
| `/api/stats` | public, user and admin dashboard statistics |
| `/api` | health, contact messages, newsletter, blog posts, images, settings |

## Run locally

```bash
git clone https://github.com/hamsakib/glowra-server.git
cd glowra-server
npm install
cp .env.example .env     # add MONGODB_URI and JWT_SECRET
npm run seed             # load demo data
npm run dev              # http://localhost:5000
```

No MongoDB installed? `npm run dev:memory` starts an in-memory database, seeds it and runs the API.

### Environment variables

| Name | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | long random string used to sign tokens |
| `JWT_EXPIRES_IN` | token lifetime, e.g. `1d` |
| `CLIENT_ORIGIN` | allowed frontend origins, comma separated |
| `PUBLIC_API_URL` | public URL of this API (used for image links) |
