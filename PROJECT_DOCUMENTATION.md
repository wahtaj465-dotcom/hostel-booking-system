# Hostel Booking System — Full Stack Presentation Document

> **Scope:** Full-stack implementation — Frontend + Backend + Database roles, interdependencies, tech stack, and every file/folder.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Frontend](#3-frontend)
   - 3.1 Tech Stack
   - 3.2 Folder Structure
   - 3.3 Every File — Purpose & Role
   - 3.4 Libraries & Their Usage
4. [Backend](#4-backend)
   - 4.1 Tech Stack
   - 4.2 Service Map
   - 4.3 API Gateway
   - 4.4 User Service
   - 4.5 Hostel Service
   - 4.6 Booking Service
   - 4.7 Notification Service
5. [Database](#5-database)
   - 5.1 MongoDB
   - 5.2 Redis
   - 5.3 Schema Definitions
6. [Message Broker — RabbitMQ](#6-message-broker--rabbitmq)
7. [Inter-Service Connectivity & Request Flow](#7-inter-service-connectivity--request-flow)
8. [Docker & Containerisation](#8-docker--containerisation)
9. [Complete Tech Stack & Library Reference](#9-complete-tech-stack--library-reference)

---

## 1. Project Overview

**Hostel Booking System** is a distributed, microservices-based full-stack web application that allows students to browse hostel rooms, book beds, manage bookings, and receive notifications — all through a clean single-page React frontend backed by five independently-running Node.js services.

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| API Gateway | Express.js (port 4000) |
| User Service | Express.js + MongoDB (port 4001) |
| Hostel Service | Express.js + MongoDB + Redis (port 4002) |
| Booking Service | Express.js + MongoDB + RabbitMQ (port 4003) |
| Notification Service | Express.js + MongoDB + RabbitMQ (port 4004) |
| Database | MongoDB 6 |
| Cache | Redis 7 |
| Message Broker | RabbitMQ 3 |
| Containerisation | Docker + Docker Compose |

---

## 2. High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         BROWSER                               │
│                  React SPA (Vite, port 5173)                  │
└─────────────────────────┬─────────────────────────────────────┘
                           │  HTTP (axios, baseURL :4000)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY  (port 4000)                    │
│  JWT verification → proxy to correct microservice               │
│  Injects x-user-id / x-user-role headers downstream            │
└────────┬──────────────┬──────────────┬──────────────┬───────────┘
         │              │              │              │
     /users         /hostels       /bookings    /notifications
         │              │              │              │
    ┌────▼───┐    ┌─────▼────┐  ┌─────▼────┐  ┌─────▼──────┐
    │ User   │    │ Hostel   │  │ Booking  │  │Notification│
    │Service │    │Service   │  │Service   │  │Service     │
    │:4001   │    │:4002     │  │:4003     │  │:4004       │
    └────┬───┘    └──┬────┬──┘  └───┬──┬───┘  └────┬───────┘
         │           │    │         │  │            │
    ┌────▼──┐  ┌─────▼─┐ ┌▼─────┐  │  │       ┌────▼──┐
    │Mongo  │  │Mongo  │ │Redis │  │  │       │Mongo  │
    │user-db│  │hostel │ │Cache │  │  │       │notif- │
    └───────┘  │-db    │ └──────┘  │  │       │db     │
               └───────┘           │  │       └───────┘
                          ┌────────▼──▼──┐
                          │   MongoDB    │
                          │  booking-db  │
                          └──────────────┘
                                  │  RabbitMQ Fanout Exchange
                          ┌───────▼──────────────────────┐
                          │         RabbitMQ              │
                          │   Exchange: booking_events    │
                          │   (fanout — broadcast)        │
                          └───────┬──────────────┬────────┘
                                  │              │
                        hostel_booking_queue  notification_booking_queue
                                  │              │
                          ┌───────▼──┐    ┌──────▼───────┐
                          │ Hostel   │    │Notification  │
                          │Consumer  │    │Consumer      │
                          │restores  │    │sends email   │
                          │beds      │    │(simulated)   │
                          └──────────┘    └──────────────┘
```

---

## 3. Frontend

### 3.1 Tech Stack

| Tool | Version | Role |
|---|---|---|
| **React** | 19.x | UI component framework |
| **Vite** | 8.x | Build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS styling |
| **React Router DOM** | 7.x | Client-side routing / SPA navigation |
| **Axios** | 1.x | HTTP client for API calls |
| **Framer Motion** | 12.x | Animation library (installed, available for use) |
| **React Hot Toast** | 2.x | Toast notification popups (installed, available) |

### 3.2 Folder Structure

```
frontend/
├── index.html                  ← Vite HTML entry point
├── vite.config.js              ← Vite + React plugin config
├── tailwind.config.js          ← Tailwind theme config
├── postcss.config.js           ← PostCSS for Tailwind processing
├── eslint.config.js            ← ESLint rules
├── package.json                ← Dependencies and scripts
└── src/
    ├── main.jsx                ← React root mount point
    ├── App.jsx                 ← Root component (layout shell)
    ├── index.css               ← Global styles
    ├── App.css                 ← App-level styles
    │
    ├── routes/
    │   └── AppRoutes.jsx       ← All route definitions + guards
    │
    ├── context/
    │   └── AuthContext.jsx     ← Global auth state (React Context API)
    │
    ├── services/               ← API communication layer
    │   ├── api.js              ← Axios instance with interceptor
    │   ├── auth.js             ← Auth API calls (register, login, getMe)
    │   ├── booking.js          ← Booking API calls
    │   ├── hostels.js          ← Hostel/room API calls
    │   └── notifications.js    ← Notifications API call
    │
    ├── pages/
    │   └── home/
    │       └── index.jsx       ← Landing page (hero, features, FAQ)
    │
    ├── Auth/
    │   ├── Login.jsx           ← Login form page
    │   └── Signup.jsx          ← Registration form page
    │
    ├── Hostels/
    │   ├── index.jsx           ← Browse all rooms (listing page)
    │   └── Details.jsx         ← Individual room details + book button
    │
    ├── Booking/
    │   └── index.jsx           ← Booking confirmation/checkout page
    │
    ├── Dashboard/
    │   └── index.jsx           ← My Bookings (user) / All Bookings (admin)
    │
    ├── Notifications/
    │   └── index.jsx           ← Notifications list page
    │
    ├── Admin/
    │   └── Analytics.jsx       ← Admin analytics dashboard (charts, stats)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx      ← Top navigation bar (auth-aware)
    │   │   └── Footer.jsx      ← Site footer
    │   ├── shared/
    │   │   └── AdminRooms.jsx  ← Admin room management (CRUD)
    │   └── ui/
    │       ├── Button.jsx      ← Reusable button component
    │       ├── Card.jsx        ← Reusable card/panel component
    │       ├── Input.jsx       ← Reusable styled input
    │       ├── FaqAccordionItem.jsx       ← Expandable FAQ item
    │       └── FeatureAccordionCard.jsx   ← Expandable feature card
    │
    └── assets/
        ├── hero.png            ← Hero image asset
        ├── react.svg           ← React logo
        └── vite.svg            ← Vite logo
```

### 3.3 Every File — Purpose & Role

#### `src/main.jsx` — Application Entry Point
- Creates the React root via `ReactDOM.createRoot`.
- Wraps the entire app in `<AuthProvider>` (global auth state) and `<BrowserRouter>` (routing).
- Imports global CSS.

#### `src/App.jsx` — Root Layout Component
- Renders `<Navbar>`, the main content area `<main>`, and `<Footer>` on every page.
- Delegates all page rendering to `<AppRoutes>`.

#### `src/routes/AppRoutes.jsx` — Route Definitions & Guards
- Defines all URL paths and maps them to page components.
- **`ProtectedRoute`**: Wraps routes that require a logged-in user. Redirects to `/login` if no user in context.
- **`AdminRoute`**: Wraps admin-only routes. Redirects to `/` if user is not an admin.
- Route list:
  - `/` → Home
  - `/hostels` → Browse rooms
  - `/hostels/:id` → Room detail
  - `/login` → Login
  - `/signup` → Signup
  - `/booking/:id` → Booking checkout (protected)
  - `/dashboard` → User/Admin dashboard (protected)
  - `/admin/rooms` → Admin room management (admin only)
  - `/admin/analytics` → Admin analytics (admin only)
  - `/notifications` → Notifications (protected)

#### `src/context/AuthContext.jsx` — Global Authentication State
- Uses React's Context API to share `user`, `login`, `register`, and `logout` functions across the entire app.
- On mount (`useEffect`), checks `localStorage` for a JWT token and restores session by calling `GET /users/me`.
- `login()`: Posts credentials → stores JWT in `localStorage` → fetches user profile → sets `user` state with an `isAdmin` flag.
- `logout()`: Clears token from `localStorage`, sets user to `null`.

#### `src/services/api.js` — Axios HTTP Client
- Creates a pre-configured Axios instance with `baseURL: "http://localhost:4000"` (the API Gateway).
- Registers a **request interceptor** that automatically attaches the `Authorization: Bearer <token>` header from `localStorage` to every outgoing request.

#### `src/services/auth.js` — Auth API Functions
- `register(data)` → `POST /users/register`
- `login(data)` → `POST /users/login`
- `getMe()` → `GET /users/me`

#### `src/services/booking.js` — Booking API Functions
- `bookRoom(data)` → `POST /bookings/book-room`
- `getMyBookings()` → `GET /bookings/my-bookings`

#### `src/services/hostels.js` — Hostel API Functions
- `getRooms()` → `GET /hostels`
- `getRoom(id)` → `GET /hostels/:id`
- `createRoom(data)` → `POST /hostels`
- `reduceBed(id)` → `PATCH /hostels/:id/reduce-bed`
- `increaseBed(id)` → `PATCH /hostels/:id/increase-bed`

#### `src/services/notifications.js` — Notifications API
- `getNotifications()` → `GET /notifications`

#### `src/pages/home/index.jsx` — Landing Page
- Hero section with CTA buttons (Explore Hostels / Dashboard).
- "Why Choose Us?" section with three expandable feature cards.
- FAQ section with accordion items.
- Fully static — no API calls.

#### `src/Auth/Login.jsx` — Login Page
- Controlled form with email + password fields.
- Calls `login()` from `AuthContext` on submit.
- On success: admin users redirected to `/dashboard`, others to `/hostels`.

#### `src/Auth/Signup.jsx` — Signup / Registration Page
- Controlled form with name, email, password.
- Calls `register()` from `AuthContext`.
- On success: redirects to `/login`.

#### `src/Hostels/index.jsx` — Hostel Listing Page
- Fetches all rooms from `GET /hostels` on mount.
- Renders a responsive grid of room cards.
- Each card shows: hostel name, room number, total beds, available beds, and an AVAILABLE/FULL status badge.
- Links to room detail (`/hostels/:id`) and direct booking (`/booking/:id`).

#### `src/Hostels/Details.jsx` — Room Detail Page
- Reads `id` from URL params, calls `GET /hostels/:id`.
- Shows room info + a pricing breakdown panel (UI-only, static values).
- **Book Now** button calls `POST /bookings/book-room` via `bookRoom()`.
- Admin buttons: **Reduce Bed** and **Increase Bed** call the respective PATCH endpoints.
- Refreshes room data after each action.

#### `src/Booking/index.jsx` — Booking Checkout Page
- Reads `id` (room ID) from URL params.
- Displays a checkout card with static pricing.
- Confirms the booking by calling `POST /bookings/book-room`.
- On success: navigates to `/dashboard`.

#### `src/Dashboard/index.jsx` — User / Admin Dashboard
- Reads `user.isAdmin` from `AuthContext`.
- **Student view**: `GET /bookings/my-bookings` → shows own bookings with a Cancel button.
- **Admin view**: `GET /bookings/all` → shows all bookings across all users.
- Cancel calls `DELETE /bookings/:id`.

#### `src/Notifications/index.jsx` — Notifications Page
- Calls `GET /notifications` on mount.
- Renders notification messages and timestamps.

#### `src/Admin/Analytics.jsx` — Admin Analytics Dashboard
- Calls `GET /bookings/all` and `GET /hostels` in parallel.
- Computes: total bookings, cancellations, total beds, available beds, occupancy rate, total revenue (₹450 × bookings).
- Renders:
  - 4 stat cards (Revenue, Bookings, Occupancy, Cancellations).
  - SVG line chart — Booking Trends (daily).
  - SVG bar chart — Revenue Growth (monthly).
  - SVG donut chart — Occupancy %.
  - Recent Activity table.

#### `src/components/layout/Navbar.jsx` — Navigation Bar
- Sticky top bar with logo, nav links.
- Conditionally renders based on auth state:
  - **Logged out**: Login + Signup links.
  - **Logged in (student)**: Dashboard + Logout.
  - **Logged in (admin)**: Dashboard + Admin + Analytics + Logout.

#### `src/components/layout/Footer.jsx` — Footer
- Simple footer with copyright year and nav links.

#### `src/components/shared/AdminRooms.jsx` — Admin Room Management
- Lists all rooms from `GET /hostels`.
- Form to create a new room (`POST /hostels`).
- Delete button per room (`DELETE /hostels/:id`).

#### `src/components/ui/Button.jsx` — Reusable Button
- Accepts `variant` prop: `primary`, `outline`, `ghost`, `danger`.
- Accepts `size` prop: `sm`, `md`, `lg`.
- Renders as `<button>` by default; can be overridden with `as` prop.

#### `src/components/ui/Card.jsx` — Reusable Card
- Exports `Card`, `CardHeader`, `CardContent` sub-components.
- Glassmorphism-style: white/80 background, blur, subtle shadow.

#### `src/components/ui/Input.jsx` — Reusable Input
- Styled text input with Tailwind: rounded corners, violet focus ring, slate border.

#### `src/components/ui/FaqAccordionItem.jsx` — FAQ Accordion
- Individual FAQ item that expands/collapses on click.
- First item opens by default (`defaultOpen` prop).

#### `src/components/ui/FeatureAccordionCard.jsx` — Feature Card
- Expandable feature card with icon, title, and details text.
- Independent open/close per card.

---

## 4. Backend

### 4.1 Tech Stack

| Tool | Role |
|---|---|
| **Node.js** | JavaScript runtime for all backend services |
| **Express.js v5** | HTTP framework for REST APIs |
| **Mongoose** | MongoDB ODM — schema definition, queries |
| **JSON Web Token (jsonwebtoken)** | Issue and verify JWT tokens |
| **bcryptjs** | Password hashing |
| **amqplib** | RabbitMQ AMQP client |
| **axios** | HTTP client (gateway proxy + inter-service calls) |
| **redis** | Redis client for caching |
| **dotenv** | Environment variable loading |
| **cors** | Cross-Origin Resource Sharing headers |
| **express-rate-limit** | Request rate limiting (gateway) |

### 4.2 Service Map

| Service | Port | DB | External Dependencies |
|---|---|---|---|
| API Gateway | 4000 | — | User, Hostel, Booking services |
| User Service | 4001 | MongoDB user-db | — |
| Hostel Service | 4002 | MongoDB hostel-db | Redis, RabbitMQ |
| Booking Service | 4003 | MongoDB booking-db | Hostel Service (HTTP), RabbitMQ |
| Notification Service | 4004 | MongoDB notification-db | RabbitMQ |

---

### 4.3 API Gateway (`api-gateway/`)

**Purpose:** Single entry point for all frontend requests. Handles JWT verification, then proxies requests to the correct microservice.

```
api-gateway/
└── src/
    ├── server.js                      ← Express app, route mounting
    ├── config/
    │   └── env.js                     ← Service URLs from environment
    ├── middlewares/
    │   └── auth.middleware.js         ← JWT verification, sets req.userId / req.userRole
    └── routes/
        ├── user.routes.js             ← Proxies /users/* → user-service:4001
        ├── hostel.routes.js           ← Proxies /hostels/* → hostel-service:4002
        └── booking.routes.js          ← Proxies /bookings/* → booking-service:4003
```

#### `server.js`
- Mounts routes:
  - `/users` → **public** (proxied without auth check)
  - `/hostels` → **GET public, write operations protected**
  - `/bookings` → **fully protected** (verifyToken applied globally)
- `verifyToken` middleware parses the JWT, extracts `userId` and `role`, and sets them on `req`.

#### `config/env.js`
- Exports service base URLs (`USER_SERVICE_URL`, `HOSTEL_SERVICE_URL`, `BOOKING_SERVICE_URL`) from environment variables.

#### `middlewares/auth.middleware.js`
- Extracts the `Bearer` token from the `Authorization` header.
- Verifies it with `jsonwebtoken` using `JWT_SECRET`.
- Sets `req.userId` and `req.userRole` for downstream route handlers.

#### `routes/booking.routes.js`
- Before proxying, injects `x-user-id` and `x-user-role` headers so the booking service knows who made the request without re-decoding the JWT.

#### `routes/hostel.routes.js`
- GET requests pass through without auth (public browsing).
- POST/PATCH/DELETE requires `verifyToken`.

---

### 4.4 User Service (`user-service/`)

**Purpose:** Manages user registration, login, and profile retrieval.

```
user-service/
└── src/
    ├── app.js                         ← Express server, DB connect
    ├── config/
    │   └── db.js                      ← Mongoose connection
    ├── controllers/
    │   └── user.controller.js         ← register, login, getMe logic
    ├── middlewares/
    │   └── auth.MiddleWare.js         ← JWT verify, loads User from DB
    ├── models/
    │   └── user.model.js              ← User schema (name, email, password, role)
    └── routes/
        └── user.routes.js             ← POST /register, POST /login, GET /me
```

#### `app.js`
- Connects MongoDB.
- Mounts `/users` routes on port 4001.

#### `models/user.model.js`
- Fields: `name`, `email` (unique), `password` (bcrypt hash), `role` (`"user"` | `"admin"`), timestamps.

#### `controllers/user.controller.js`
- **`register`**: Hashes password with bcrypt (cost 10), creates User document.
- **`login`**: Hardcoded admin shortcut (`admin@hostel.com` / `admin123`). For regular users: finds by email, compares bcrypt hash, signs JWT with `{ userId, role }`, 1-day expiry.
- **`getMe`**: Returns the user object attached to `req.user` by the auth middleware.

#### `middlewares/auth.MiddleWare.js`
- Decodes JWT → finds `User` by `decoded.userId` in MongoDB → attaches full user object to `req.user`, `req.userId`, `req.userRole`.

---

### 4.5 Hostel Service (`hostel-service/`)

**Purpose:** CRUD for hostel rooms, bed availability management with Redis caching, and RabbitMQ consumer to restore beds on cancellation.

```
hostel-service/
└── src/
    ├── app.js                         ← Express server, starts all connections
    ├── config/
    │   └── db.js                      ← Mongoose connection
    ├── cache/
    │   └── redis.client.js            ← Redis client creation and connect
    ├── controllers/
    │   └── hostel.controller.js       ← CRUD + atomic bed operations
    ├── events/
    │   └── booking.consumer.js        ← RabbitMQ fanout consumer
    ├── models/
    │   └── room.model.js              ← Room schema
    └── routes/
        └── hostel.routes.js           ← Route definitions with admin guards
```

#### `app.js`
- Calls: `connectDB()` → `connectRedis()` → `startBookingConsumer()` → starts Express on port 4002.

#### `models/room.model.js`
- Fields: `hostelName`, `roomNumber`, `totalBeds`, `availableBeds`, timestamps.

#### `cache/redis.client.js`
- Creates a Redis client connected to `REDIS_URL`.
- Exports `connectRedis()` and `getRedisClient()`.

#### `controllers/hostel.controller.js`
- **`getRooms`**: Checks Redis key `"all_rooms"` → cache HIT returns JSON directly → cache MISS queries MongoDB, stores result in Redis with 60s TTL.
- **`createRoom`**: Inserts room, then `redis.del("all_rooms")` to invalidate cache.
- **`reduceBed`** (atomic): Uses `Room.updateOne({ _id, availableBeds: { $gt: 0 } }, { $inc: { availableBeds: -1 } })`. The `$gt: 0` condition ensures no race condition — only updates if a bed is actually available. Invalidates cache.
- **`increaseBed`**: Increments `availableBeds` by 1. Invalidates cache.
- **`deleteRoom`**, **`updateRoom`**: Standard Mongoose operations + cache invalidation.

#### `events/booking.consumer.js`
- Connects to RabbitMQ fanout exchange `booking_events`.
- Creates queue `hostel_booking_queue` and binds it to the exchange.
- On `BOOKING_CANCELLED` event: restores 1 bed via `$inc: { availableBeds: 1 }`.

#### `routes/hostel.routes.js`
- `GET /hostels` — public
- `GET /hostels/:id` — public
- `POST /hostels` — admin only (checks `x-user-role` header)
- `PATCH /hostels/:id/reduce-bed` — called internally by booking service
- `PATCH /hostels/:id/increase-bed` — admin-accessible
- `PATCH /hostels/:id` — admin only
- `DELETE /hostels/:id` — admin only

---

### 4.6 Booking Service (`booking-service/`)

**Purpose:** Creates and cancels bookings, orchestrates the atomic bed reservation via Hostel Service, and publishes events to RabbitMQ.

```
booking-service/
└── src/
    ├── app.js                         ← Express server, connects DB + RabbitMQ
    ├── config/
    │   └── db.js                      ← Mongoose connection
    ├── controllers/
    │   └── booking.controller.js      ← bookRoom, cancelBooking, getMyBookings, getAllBookings
    ├── events/
    │   ├── producer.js                ← RabbitMQ publisher
    │   └── topics.js                  ← Event/exchange name constants
    ├── middlewares/
    │   └── auth.middleware.js         ← Local JWT verification
    ├── models/
    │   └── booking.model.js           ← Booking schema
    └── routes/
        └── booking.routes.js          ← Route definitions
```

#### `models/booking.model.js`
- Fields: `roomId` (string), `userId` (string), `status` (`"CONFIRMED"` | `"CANCELLED"`), timestamps.

#### `events/producer.js`
- Connects to RabbitMQ, asserts `booking_events` fanout exchange.
- `publishBookingEvent(data)`: serialises event payload to JSON and publishes to the exchange with `persistent: true`.

#### `events/topics.js`
- Centralised constants: `BOOKING_EXCHANGE`, `BOOKING_CREATED`, `BOOKING_CANCELLED`.

#### `controllers/booking.controller.js`
- **`bookRoom`**:
  1. Reads `x-user-id` from headers (forwarded by gateway).
  2. Calls `PATCH /hostels/:roomId/reduce-bed` on Hostel Service — atomic check.
  3. If successful, creates `Booking` document with status `"CONFIRMED"`.
  4. Publishes `BOOKING_CREATED` event to RabbitMQ.
- **`cancelBooking`**:
  1. Finds booking by `_id` + `userId` + `status: "CONFIRMED"`.
  2. Sets `status = "CANCELLED"`, saves.
  3. Publishes `BOOKING_CANCELLED` event — Hostel Service consumer restores the bed.
- **`getMyBookings`**: Finds all bookings by `userId`.
- **`getAllBookings`**: Admin only (checks `x-user-role: admin` header). Returns all bookings.

---

### 4.7 Notification Service (`notification-service/`)

**Purpose:** Subscribes to RabbitMQ booking events and sends email notifications (currently simulated via console.log).

```
notification-service/
└── src/
    ├── app.js                         ← Express server, MongoDB + RabbitMQ startup
    ├── config/
    │   └── rabbitmq.js                ← RabbitMQ connection with retry loop
    ├── consumers/
    │   └── booking.consumers.js       ← Fanout consumer for booking_events
    ├── middlewares/
    │   └── auth.middleware.js         ← JWT verify for HTTP routes
    ├── models/
    │   └── notification.model.js      ← Notification schema (userId, message)
    ├── routes/
    │   └── notification.routes.js     ← GET /notifications (user's own)
    └── services/
        └── email.service.js           ← Email sender (simulated)
```

#### `consumers/booking.consumers.js`
- Binds queue `notification_booking_queue` to `booking_events` fanout exchange.
- On `BOOKING_CREATED`: calls `sendEmail(bookingData)`.
- On `BOOKING_CANCELLED`: calls `sendEmail(bookingData)`.

#### `services/email.service.js`
- Simulates sending email — logs booking details to console.
- (No actual SMTP/email provider integrated yet.)

#### `routes/notification.routes.js`
- `GET /notifications` — protected by JWT. Returns all notifications for `req.userId`.

#### `config/rabbitmq.js`
- Connects to RabbitMQ with a `while(true)` retry loop — waits 5 seconds between attempts until RabbitMQ is ready.

---

## 5. Database

### 5.1 MongoDB

MongoDB runs as a single instance but with **four separate logical databases** (one per service), maintaining microservice data isolation.

| Database | Owner Service | Collections |
|---|---|---|
| `user-service-db` | User Service | `users` |
| `hostel-service-db` | Hostel Service | `rooms` |
| `booking-service-db` | Booking Service | `bookings` |
| `notification-service-db` | Notification Service | `notifications` |

#### Why separate databases?
Each microservice owns its data. No service accesses another service's database directly — they communicate through HTTP APIs or message events. This is a core microservices principle.

### 5.2 Redis

Redis runs as an in-memory cache used exclusively by the **Hostel Service**.

| Key | Value | TTL | Purpose |
|---|---|---|---|
| `all_rooms` | JSON array of all rooms | 60 seconds | Cache `GET /hostels` response |

**Cache-aside pattern:**
1. Request arrives → check Redis.
2. Cache HIT → return cached JSON instantly.
3. Cache MISS → query MongoDB → store in Redis → return response.
4. On any write (create/update/delete/reduce/increase bed) → `redis.del("all_rooms")` invalidates the cache.

### 5.3 Schema Definitions

#### User Schema (`user-service-db.users`)
```
{
  name:      String  (required)
  email:     String  (required, unique)
  password:  String  (required, bcrypt hash)
  role:      String  (enum: "user" | "admin", default: "user")
  createdAt: Date    (auto)
  updatedAt: Date    (auto)
}
```

#### Room Schema (`hostel-service-db.rooms`)
```
{
  hostelName:    String  (required)
  roomNumber:    String  (required)
  totalBeds:     Number  (required)
  availableBeds: Number  (required)
  createdAt:     Date    (auto)
  updatedAt:     Date    (auto)
}
```

#### Booking Schema (`booking-service-db.bookings`)
```
{
  roomId:    String  (required)
  userId:    String  (required)
  status:    String  (default: "CONFIRMED", can be "CANCELLED")
  createdAt: Date    (auto)
  updatedAt: Date    (auto)
}
```

#### Notification Schema (`notification-service-db.notifications`)
```
{
  userId:    String  (required)
  message:   String  (required)
  createdAt: Date    (auto)
  updatedAt: Date    (auto)
}
```

---

## 6. Message Broker — RabbitMQ

### Exchange Type: Fanout

The system uses a **fanout exchange** named `booking_events`. A fanout exchange broadcasts every published message to **all bound queues** simultaneously. This means:

- When Booking Service publishes a single event, **both** Hostel Service and Notification Service receive it independently.
- Services are fully decoupled — Booking Service doesn't know or care who's listening.

### Event Flow

```
Booking Service
     │
     │ publishBookingEvent({ type, bookingId, userId, roomId })
     ▼
Exchange: booking_events (fanout)
     │                      │
     ▼                      ▼
hostel_booking_queue    notification_booking_queue
     │                      │
     ▼                      ▼
Hostel Consumer         Notification Consumer
(restore bed on         (send email on
 BOOKING_CANCELLED)      BOOKING_CREATED /
                         BOOKING_CANCELLED)
```

### Events Published

| Event Type | Trigger | Payload |
|---|---|---|
| `BOOKING_CREATED` | Room booked successfully | `{ type, bookingId, userId, roomId }` |
| `BOOKING_CANCELLED` | Booking cancelled by user | `{ type, bookingId, userId, roomId }` |

---

## 7. Inter-Service Connectivity & Request Flow

### Flow 1: User Registration
```
Browser → POST /users/register
→ API Gateway (no auth needed, public)
→ proxy → User Service :4001 POST /users/register
→ Hash password (bcrypt)
→ Save User to user-service-db
→ Return { message: "Registered successfully" }
```

### Flow 2: User Login
```
Browser → POST /users/login { email, password }
→ API Gateway (public)
→ proxy → User Service :4001 POST /users/login
→ Find user by email
→ bcrypt.compare(password, hash)
→ jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1d" })
→ Return { token: "..." }
→ Frontend stores token in localStorage
```

### Flow 3: Browse Rooms (with caching)
```
Browser → GET /hostels
→ API Gateway (public, no auth)
→ proxy → Hostel Service :4002 GET /hostels
→ Check Redis key "all_rooms"
  ├── HIT: return JSON from Redis (fast)
  └── MISS: query MongoDB rooms collection
            → store in Redis (TTL 60s)
            → return to client
```

### Flow 4: Book a Room (full distributed flow)
```
Browser → POST /bookings/book-room { roomId }
  (Authorization: Bearer <JWT>)
→ API Gateway
  → verifyToken middleware: decode JWT → req.userId = "abc123", req.userRole = "user"
  → proxy → Booking Service :4003 POST /bookings/book-room
    (headers forwarded: x-user-id: "abc123", x-user-role: "user")
→ Booking Service:
  1. Read userId from x-user-id header
  2. HTTP PATCH → Hostel Service :4002 /hostels/:roomId/reduce-bed
     → Atomic MongoDB: updateOne({ availableBeds: { $gt: 0 } }, { $inc: -1 })
     → Invalidate Redis cache
  3. Create Booking { userId, roomId, status: "CONFIRMED" }
  4. Publish to RabbitMQ → booking_events exchange
     → BOOKING_CREATED event broadcast
→ RabbitMQ fans out to:
  - hostel_booking_queue → Hostel Consumer (no action on CREATED)
  - notification_booking_queue → Notification Consumer → sendEmail() [simulated]
→ Return { message: "Room booked", booking }
```

### Flow 5: Cancel a Booking
```
Browser → DELETE /bookings/:id
→ API Gateway → verifyToken → proxy to Booking Service
→ Booking Service:
  1. Find booking by _id + userId + status "CONFIRMED"
  2. Set status = "CANCELLED", save
  3. Publish BOOKING_CANCELLED to RabbitMQ exchange
→ RabbitMQ fans out:
  - Hostel Consumer: Room.updateOne($inc: availableBeds +1) → cache invalidated
  - Notification Consumer: sendEmail() [simulated]
```

### Flow 6: Admin Views All Bookings
```
Browser → GET /bookings/all
  (Authorization: Bearer <admin-JWT>)
→ API Gateway → verifyToken → sets x-user-role: "admin" header
→ proxy → Booking Service :4003 GET /bookings/all
→ Route middleware checks x-user-role === "admin"
→ Booking.find().sort({ createdAt: -1 })
→ Return all bookings
```

### Header Propagation Pattern
The gateway acts as a trust boundary. After verifying the JWT, it injects:
- `x-user-id` — the user's MongoDB `_id`
- `x-user-role` — `"user"` or `"admin"`

Downstream services **do not re-verify JWTs** — they trust these headers (they only listen on internal Docker network ports, so external callers cannot spoof them).

---

## 8. Docker & Containerisation

### `docker-compose.yml` — Services and Health Checks

All services are defined in a single `docker-compose.yml` with proper dependency ordering via `healthcheck` and `depends_on: condition: service_healthy`.

| Service | Image / Build | Port | Health Check |
|---|---|---|---|
| `mongo` | `mongo:6` | 27017 | `mongosh ping` |
| `rabbitmq` | `rabbitmq:3-management` | 5672, 15672 | `rabbitmq-diagnostics ping` |
| `redis` | `redis:7` | 6379 | `redis-cli ping` |
| `user-service` | `./user-service` (Dockerfile) | 4001 | waits for mongo |
| `hostel-service` | `./hostel-service` (Dockerfile) | 4002 | waits for mongo, rabbitmq, redis |
| `booking-service` | `./booking-service` (Dockerfile) | 4003 | waits for mongo, rabbitmq |
| `notification-service` | `./notification-service` (Dockerfile) | 4004 | waits for mongo, rabbitmq |
| `api-gateway` | `./api-gateway` (Dockerfile) | 4000 | waits for all services |

### Start Command
```bash
docker-compose up --build
```

### Volume
- `mongo-data` — persistent named volume for MongoDB data.

---

## 9. Complete Tech Stack & Library Reference

### Frontend Libraries

| Library | Version | Usage |
|---|---|---|
| `react` | 19.x | Core UI framework — components, hooks, state |
| `react-dom` | 19.x | DOM rendering (`ReactDOM.createRoot`) |
| `react-router-dom` | 7.x | Client-side routing, `<Routes>`, `<Route>`, `useNavigate`, `useParams`, `Link` |
| `axios` | 1.x | HTTP client — API calls with interceptors for auto-token injection |
| `framer-motion` | 12.x | Animation library (installed, available for animations) |
| `react-hot-toast` | 2.x | Toast notifications (installed, available) |
| `tailwindcss` | 3.x | Utility-first CSS — all styling done via class names |
| `@tailwindcss/vite` | 4.x | Tailwind plugin for Vite build pipeline |
| `vite` | 8.x | Frontend build tool and dev server (HMR) |
| `@vitejs/plugin-react` | 6.x | React Fast Refresh support in Vite |
| `postcss` | 8.x | CSS processing (required by Tailwind) |
| `autoprefixer` | 10.x | Automatically adds CSS vendor prefixes |
| `eslint` | 9.x | JavaScript linting |

### Backend Libraries (all Node.js services)

| Library | Usage |
|---|---|
| `express` (v5) | HTTP web framework — routing, middleware, request/response handling |
| `mongoose` | MongoDB ODM — schema definition, model creation, queries |
| `jsonwebtoken` | Signing and verifying JWTs for authentication |
| `bcryptjs` | Hashing passwords before storage; comparing on login |
| `dotenv` | Loads `.env` file into `process.env` |
| `cors` | Sets CORS headers to allow frontend (different origin) to call backend |
| `amqplib` | AMQP 0-9-1 client — connects to RabbitMQ, publishes/consumes messages |
| `axios` | HTTP client (used in API Gateway to proxy requests, and in Booking Service to call Hostel Service) |
| `redis` | Official Redis client for Node.js — used in Hostel Service for caching |
| `express-rate-limit` | Rate limiter middleware (installed in gateway) |
| `nodemon` | Dev-only: auto-restarts server on file changes |

### Infrastructure

| Technology | Version | Role |
|---|---|---|
| **MongoDB** | 6 | Primary persistent database for all services |
| **Redis** | 7 | In-memory cache for hostel room listings |
| **RabbitMQ** | 3 + management plugin | Message broker for async event-driven communication |
| **Docker** | — | Container runtime |
| **Docker Compose** | v3.8 | Multi-container orchestration |

### Key Design Patterns Used

| Pattern | Where Applied |
|---|---|
| **Microservices Architecture** | 5 independent services, each owning its own DB |
| **API Gateway Pattern** | Single entry point, auth enforcement, request proxy |
| **Fanout Exchange (Pub/Sub)** | RabbitMQ broadcasts booking events to multiple consumers |
| **Cache-Aside Pattern** | Redis caches room listings, invalidated on writes |
| **Atomic Database Operations** | `$gt: 0` + `$inc` prevents race conditions on bed booking |
| **RBAC (Role-Based Access Control)** | `admin` vs `user` role enforced at gateway and service level |
| **Header-Based Identity Propagation** | `x-user-id` / `x-user-role` headers forwarded after JWT verification |
| **Event-Driven Architecture** | Booking cancellation triggers bed restoration without direct service call |
| **Protected Routes (Frontend)** | `ProtectedRoute` / `AdminRoute` components wrap sensitive pages |
| **Context API (Frontend)** | Global auth state shared across all components without prop drilling |

---

*Document generated for full-stack presentation — Hostel Booking System*
