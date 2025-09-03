# Event Info Demo

A full-stack web application for discovering and managing events, built with React.js (frontend) and Node.js + Express (backend). This is a simplified version of an Event Info platform with CRUD operations, filtering, and interactive features.

## 🚀 Features

### Frontend (React.js + Tailwind CSS)

- **Home Page**: Browse events with filtering by city, category, and date
- **Trending Section**: Showcases popular events
- **Event Details**: Detailed view with embedded maps
- **Admin Panel**: Create, edit, and delete events
- **Hotel Dashboard**: Partner registration and service management
- **Responsive Design**: Mobile-friendly interface
- **Interactive Maps**: Google Maps integration for venue locations

### Backend (Node.js + Express)

- **REST API**: Complete CRUD operations for events
- **Hotel Partner System**: JWT-based authentication and service management
- **CORS Enabled**: Cross-origin requests supported
- **In-Memory Storage**: Simple data persistence (no database required)
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation for all endpoints

## 📋 API Endpoints

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| GET    | `/api/events`           | Get all events   |
| GET    | `/api/events/:id`       | Get single event |
| POST   | `/api/admin/events`     | Create new event |
| PUT    | `/api/admin/events/:id` | Update event     |
| DELETE | `/api/admin/events/:id` | Delete event     |
| GET    | `/api/health`           | Health check     |

## 🔑 Public API Access (For Developers)

The Event Info Demo provides a public API for developers to access event data programmatically. All public API endpoints require authentication using an API key.

### Authentication

To access the public API, you must include an API key in the request headers:

- **Header name**: `x-api-key`
- **API Key**: `12345` (demo key)

### Public API Endpoints

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/public/events`     | Get all events (public API)   |
| GET    | `/api/public/events/:id` | Get single event (public API) |

### Example Usage

#### Get All Events

```bash
curl -H "x-api-key: 12345" http://localhost:5000/api/public/events
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Music Concert",
      "category": "Concert",
      "city": "Lahore",
      "date": "2025-09-15",
      "venue": "Expo Center",
      "description": "A live music concert featuring famous bands.",
      "ticketInfo": "Tickets available online",
      "organizer": "XYZ Events",
      "latitude": 31.5204,
      "longitude": 74.3587
    }
  ],
  "count": 5,
  "message": "Events retrieved successfully"
}
```

#### Get Single Event

```bash
curl -H "x-api-key: 12345" http://localhost:5000/api/public/events/1
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Music Concert",
    "category": "Concert",
    "city": "Lahore",
    "date": "2025-09-15",
    "venue": "Expo Center",
    "description": "A live music concert featuring famous bands.",
    "ticketInfo": "Tickets available online",
    "organizer": "XYZ Events",
    "latitude": 31.5204,
    "longitude": 74.3587
  },
  "message": "Event retrieved successfully"
}
```

### Error Responses

#### Missing API Key

```json
{
  "success": false,
  "message": "API key is required. Please provide x-api-key header."
}
```

#### Invalid API Key

```json
{
  "success": false,
  "message": "Invalid API key."
}
```

#### Event Not Found

```json
{
  "success": false,
  "message": "Event not found"
}
```

## 🛠️ Tech Stack

### Frontend

- **React.js** 18.2.0
- **React Router** 6.3.0 (Navigation)
- **Tailwind CSS** 3.3.2 (Styling)
- **Axios** 1.4.0 (HTTP Client)

### Backend

- **Node.js**
- **Express.js** 4.18.2 (Web Framework)
- **CORS** 2.8.5 (Cross-Origin Resource Sharing)
- **Body Parser** 1.20.2 (Request Parsing)
- **Dotenv** 16.3.1 (Environment Variables)
- **JSON Web Token** 9.0.2 (JWT Authentication)
- **BCryptJS** 2.4.3 (Password Hashing)

## 🏨 Hotel/Partner Features

The Event Info Demo includes a comprehensive hotel partner system that allows hotels to register, manage services, and create event packages.

### Hotel Authentication

Hotels can sign up and login to access their dedicated dashboard.

#### Hotel Signup

```bash
curl -X POST http://localhost:5000/api/hotels/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel",
    "email": "contact@grandhotel.com",
    "password": "securepassword123"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "message": "Hotel registered successfully",
  "data": {
    "hotel": {
      "id": 1,
      "name": "Grand Hotel",
      "email": "contact@grandhotel.com",
      "createdAt": "2025-09-03T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Hotel Login

```bash
curl -X POST http://localhost:5000/api/hotels/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@grandhotel.com",
    "password": "securepassword123"
  }'
```

### Hotel Services Management

Hotels can add and manage their services (banquet halls, catering, etc.).

#### Add Service

```bash
curl -X POST http://localhost:5000/api/hotels/1/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceName": "Banquet Hall",
    "description": "Large hall for 200 guests with modern amenities"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "message": "Service added successfully",
  "data": {
    "id": 1,
    "hotelId": 1,
    "serviceName": "Banquet Hall",
    "description": "Large hall for 200 guests with modern amenities",
    "createdAt": "2025-09-03T10:30:00.000Z"
  }
}
```

#### Get Hotel Services

```bash
curl -X GET http://localhost:5000/api/hotels/1/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Hotel Event Packages

Hotels can create custom packages linked to existing events.

#### Create Hotel-Event Package

```bash
curl -X POST http://localhost:5000/api/hotels/1/packages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "eventId": 1,
    "packageName": "Premium Event Package",
    "details": "Includes banquet hall, catering for 100 people, decoration, and sound system",
    "price": 2500.00
  }'
```

**Example Response:**

```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "id": 1,
    "hotelId": 1,
    "eventId": 1,
    "packageName": "Premium Event Package",
    "details": "Includes banquet hall, catering for 100 people, decoration, and sound system",
    "price": 2500.0,
    "createdAt": "2025-09-03T11:00:00.000Z",
    "event": {
      "id": 1,
      "title": "Music Concert",
      "date": "2025-09-15",
      "venue": "Expo Center",
      "city": "Lahore"
    }
  }
}
```

#### Get Hotel Packages

```bash
curl -X GET http://localhost:5000/api/hotels/1/packages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Hotel Dashboard Features

The frontend provides a comprehensive hotel dashboard with:

- **Authentication**: Secure login/signup with JWT tokens
- **Service Management**: Add and view hotel services
- **Package Creation**: Create packages linked to events
- **Event Integration**: Select from available events when creating packages
- **Dashboard Analytics**: View counts of services and packages

#### Access Hotel Dashboard

1. Navigate to `/hotel/login` or click "Hotel Partner" in the navigation
2. Sign up for a new account or login with existing credentials
3. Access the dashboard to manage services and packages
4. Create packages by selecting events from the dropdown

### Hotel API Endpoints Summary

| Method | Endpoint                   | Description          | Auth Required |
| ------ | -------------------------- | -------------------- | ------------- |
| POST   | `/api/hotels/signup`       | Register new hotel   | No            |
| POST   | `/api/hotels/login`        | Login hotel          | No            |
| POST   | `/api/hotels/:id/services` | Add hotel service    | Yes (JWT)     |
| GET    | `/api/hotels/:id/services` | Get hotel services   | Yes (JWT)     |
| POST   | `/api/hotels/:id/packages` | Create event package | Yes (JWT)     |
| GET    | `/api/hotels/:id/packages` | Get hotel packages   | Yes (JWT)     |

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt for secure password storage
- **Authorization**: Hotels can only manage their own resources
- **Token Expiration**: 24-hour token validity
- **Auto-logout**: Automatic logout on token expiration

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd event-info-demo
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
# or for development with auto-restart
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Development

### Backend Development

- Server file: `backend/server.js`
- Auto-restart on changes: `npm run dev` (requires nodemon)
- API testing: Use Postman or any HTTP client with `http://localhost:5000`

### Frontend Development

- Main App: `frontend/src/App.js`
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`
- API Service: `frontend/src/services/api.js`
- Styling: Tailwind CSS classes + `frontend/src/index.css`

### Project Structure

```
event-info-demo/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── MapComponent.js
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Admin.js
│   │   │   ├── EventDetail.js
│   │   │   └── Home.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
└── README.md
```

## 🎯 Usage

### Browsing Events

1. Visit `http://localhost:3000`
2. Browse events on the home page
3. Use filters to find specific events by city, category, or date
4. Click on any event to view detailed information

### Admin Functions

1. Navigate to `/admin` or click "Admin" in the navigation
2. **Add Event**: Click "Add New Event" and fill out the form
3. **Edit Event**: Click "Edit" next to any event in the table
4. **Delete Event**: Click "Delete" and confirm the action

### Sample Event Data

The backend comes pre-loaded with 5 sample events:

- Music Concert (Lahore)
- Tech Conference (Karachi)
- Food Festival (Islamabad)
- Art Exhibition (Lahore)
- Sports Championship (Karachi)

## 🗺️ Maps Integration

The application includes map components showing event locations. For production use:

1. **Google Maps API**: Replace `YOUR_API_KEY` in `MapComponent.js`
2. **Mapbox**: Alternative mapping solution
3. **OpenStreetMap**: Free alternative option

Current implementation shows placeholder maps with location coordinates and direct links to Google Maps.

## 🔐 Environment Variables

### Backend (.env file - optional)

```
PORT=5000
NODE_ENV=development
DEMO_API_KEY=12345
JWT_SECRET=your-secret-key-for-demo
```

### Frontend (.env file - optional)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Update CORS settings for production domains
3. Deploy to platforms like Heroku, Vercel, or Railway

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `build` folder to static hosting services
3. Update API_URL environment variable to point to production backend

## 🧪 Testing

### API Testing

```bash
# Test backend endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/events

# Test public API endpoints (requires API key)
curl -H "x-api-key: 12345" http://localhost:5000/api/public/events
curl -H "x-api-key: 12345" http://localhost:5000/api/public/events/1
```

**Windows Users**: You can also use the provided test script:

```bash
test-public-api.bat
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🔄 Data Persistence

**Current**: Events are stored in memory and reset on server restart.

## ❗ Known Limitations

1. **Data Persistence**: Data resets on server restart
2. **Authentication**: No user authentication implemented
3. **Image Uploads**: No event image upload functionality
4. **Real Maps**: Placeholder maps (requires API keys)
5. **Error Boundaries**: Limited error handling in React components

**Happy Coding! 🎉**

This is a demo project showcasing modern web development practices with React.js and Node.js.
