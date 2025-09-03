const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy events data (in-memory storage)
let events = [
  {
    id: 1,
    title: "Music Concert",
    category: "Concert",
    city: "Lahore",
    date: "2025-09-15",
    venue: "Expo Center",
    description: "A live music concert featuring famous bands.",
    ticketInfo: "Tickets available online",
    organizer: "XYZ Events",
    latitude: 31.5204,
    longitude: 74.3587,
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    category: "Conference",
    city: "Karachi",
    date: "2025-09-20",
    venue: "Convention Center",
    description:
      "Annual technology conference featuring industry leaders and innovative workshops.",
    ticketInfo: "Early bird tickets available",
    organizer: "Tech Innovators",
    latitude: 24.8607,
    longitude: 67.0011,
  },
  {
    id: 3,
    title: "Food Festival",
    category: "Festival",
    city: "Islamabad",
    date: "2025-09-25",
    venue: "F-9 Park",
    description:
      "Celebrate diverse cuisines from around the world with local and international chefs.",
    ticketInfo: "Free entry, pay per item",
    organizer: "Culinary Association",
    latitude: 33.6844,
    longitude: 73.0479,
  },
  {
    id: 4,
    title: "Art Exhibition",
    category: "Exhibition",
    city: "Lahore",
    date: "2025-10-01",
    venue: "Alhamra Arts Center",
    description:
      "Contemporary art exhibition showcasing works by emerging and established artists.",
    ticketInfo: "Rs. 200 per person",
    organizer: "Art Gallery Pakistan",
    latitude: 31.5497,
    longitude: 74.3436,
  },
  {
    id: 5,
    title: "Sports Championship",
    category: "Sports",
    city: "Karachi",
    date: "2025-10-05",
    venue: "National Stadium",
    description:
      "Annual sports championship featuring multiple disciplines and athletes.",
    ticketInfo: "Season passes available",
    organizer: "Sports Federation",
    latitude: 24.8738,
    longitude: 67.0362,
  },
];

let nextId = 6;

// Hotel data storage (in-memory)
let hotels = [];
let hotelServices = [];
let hotelPackages = [];
let nextHotelId = 1;
let nextServiceId = 1;
let nextPackageId = 1;

// API Authentication Middleware
const apiAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.DEMO_API_KEY;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key is required. Please provide x-api-key header.",
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid API key.",
    });
  }

  next();
};

// Hotel JWT Authentication Middleware
const hotelAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.hotel = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Routes

// GET /api/events - Get all events
app.get("/api/events", (req, res) => {
  try {
    res.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// GET /api/events/:id - Get single event
app.get("/api/events/:id", (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
});

// POST /api/admin/events - Add new event
app.post("/api/admin/events", (req, res) => {
  try {
    const {
      title,
      category,
      city,
      date,
      venue,
      description,
      ticketInfo,
      organizer,
      latitude,
      longitude,
    } = req.body;

    // Basic validation
    if (!title || !category || !city || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, category, city, date, venue",
      });
    }

    const newEvent = {
      id: nextId++,
      title,
      category,
      city,
      date,
      venue,
      description: description || "",
      ticketInfo: ticketInfo || "",
      organizer: organizer || "",
      latitude: latitude || 0,
      longitude: longitude || 0,
    };

    events.push(newEvent);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
});

// PUT /api/admin/events/:id - Update event
app.put("/api/admin/events/:id", (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const {
      title,
      category,
      city,
      date,
      venue,
      description,
      ticketInfo,
      organizer,
      latitude,
      longitude,
    } = req.body;

    // Update event with provided fields
    events[eventIndex] = {
      ...events[eventIndex],
      ...(title && { title }),
      ...(category && { category }),
      ...(city && { city }),
      ...(date && { date }),
      ...(venue && { venue }),
      ...(description !== undefined && { description }),
      ...(ticketInfo !== undefined && { ticketInfo }),
      ...(organizer !== undefined && { organizer }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
    };

    res.json({
      success: true,
      message: "Event updated successfully",
      data: events[eventIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
});

// DELETE /api/admin/events/:id - Delete event
app.delete("/api/admin/events/:id", (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex((e) => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const deletedEvent = events.splice(eventIndex, 1)[0];

    res.json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
});

// Public API Routes (with authentication)
// GET /api/public/events - Get all events (public API)
app.get("/api/public/events", apiAuth, (req, res) => {
  try {
    res.json({
      success: true,
      data: events,
      count: events.length,
      message: "Events retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
});

// GET /api/public/events/:id - Get single event (public API)
app.get("/api/public/events/:id", apiAuth, (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
      message: "Event retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
});

// Hotel Authentication Routes
// POST /api/hotels/signup - Register a hotel
app.post("/api/hotels/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if hotel already exists
    const existingHotel = hotels.find((h) => h.email === email);
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new hotel
    const newHotel = {
      id: nextHotelId++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    hotels.push(newHotel);

    // Generate JWT token
    const token = jwt.sign(
      { hotelId: newHotel.id, email: newHotel.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      data: {
        hotel: {
          id: newHotel.id,
          name: newHotel.name,
          email: newHotel.email,
          createdAt: newHotel.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering hotel",
      error: error.message,
    });
  }
});

// POST /api/hotels/login - Login hotel
app.post("/api/hotels/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find hotel
    const hotel = hotels.find((h) => h.email === email);
    if (!hotel) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, hotel.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { hotelId: hotel.id, email: hotel.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        hotel: {
          id: hotel.id,
          name: hotel.name,
          email: hotel.email,
          createdAt: hotel.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// Hotel Services Routes
// POST /api/hotels/:hotelId/services - Add hotel service
app.post("/api/hotels/:hotelId/services", hotelAuth, (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const { serviceName, description } = req.body;

    // Check if hotel owns this resource
    if (req.hotel.hotelId !== hotelId) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own hotel services",
      });
    }

    // Basic validation
    if (!serviceName || !description) {
      return res.status(400).json({
        success: false,
        message: "Service name and description are required",
      });
    }

    // Create new service
    const newService = {
      id: nextServiceId++,
      hotelId,
      serviceName,
      description,
      createdAt: new Date().toISOString(),
    };

    hotelServices.push(newService);

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: newService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding service",
      error: error.message,
    });
  }
});

// GET /api/hotels/:hotelId/services - Get hotel services
app.get("/api/hotels/:hotelId/services", hotelAuth, (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);

    // Check if hotel owns this resource
    if (req.hotel.hotelId !== hotelId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own hotel services",
      });
    }

    const services = hotelServices.filter((s) => s.hotelId === hotelId);

    res.json({
      success: true,
      data: services,
      count: services.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message,
    });
  }
});

// Hotel Event Packages Routes
// POST /api/hotels/:hotelId/packages - Create event package
app.post("/api/hotels/:hotelId/packages", hotelAuth, (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    const { eventId, packageName, details, price } = req.body;

    // Check if hotel owns this resource
    if (req.hotel.hotelId !== hotelId) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own hotel packages",
      });
    }

    // Basic validation
    if (!eventId || !packageName || !details || !price) {
      return res.status(400).json({
        success: false,
        message: "Event ID, package name, details, and price are required",
      });
    }

    // Check if event exists
    const event = events.find((e) => e.id === parseInt(eventId));
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Create new package
    const newPackage = {
      id: nextPackageId++,
      hotelId,
      eventId: parseInt(eventId),
      packageName,
      details,
      price: parseFloat(price),
      createdAt: new Date().toISOString(),
    };

    hotelPackages.push(newPackage);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: {
        ...newPackage,
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
          venue: event.venue,
          city: event.city,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating package",
      error: error.message,
    });
  }
});

// GET /api/hotels/:hotelId/packages - Get hotel packages
app.get("/api/hotels/:hotelId/packages", hotelAuth, (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId);

    // Check if hotel owns this resource
    if (req.hotel.hotelId !== hotelId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own hotel packages",
      });
    }

    const packages = hotelPackages.filter((p) => p.hotelId === hotelId);

    // Enrich packages with event details
    const enrichedPackages = packages.map((pkg) => {
      const event = events.find((e) => e.id === pkg.eventId);
      return {
        ...pkg,
        event: event
          ? {
              id: event.id,
              title: event.title,
              date: event.date,
              venue: event.venue,
              city: event.city,
            }
          : null,
      };
    });

    res.json({
      success: true,
      data: enrichedPackages,
      count: enrichedPackages.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching packages",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Event Info Demo API is running",
    timestamp: new Date().toISOString(),
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Event Info Demo API",
    version: "1.0.0",
    endpoints: {
      events: "/api/events",
      singleEvent: "/api/events/:id",
      createEvent: "POST /api/admin/events",
      updateEvent: "PUT /api/admin/events/:id",
      deleteEvent: "DELETE /api/admin/events/:id",
      health: "/api/health",
      publicEvents: "GET /api/public/events (requires x-api-key header)",
      publicSingleEvent:
        "GET /api/public/events/:id (requires x-api-key header)",
      hotelSignup: "POST /api/hotels/signup",
      hotelLogin: "POST /api/hotels/login",
      hotelServices: "POST /api/hotels/:hotelId/services (requires auth)",
      hotelPackages: "POST /api/hotels/:hotelId/packages (requires auth)",
      getHotelServices: "GET /api/hotels/:hotelId/services (requires auth)",
      getHotelPackages: "GET /api/hotels/:hotelId/packages (requires auth)",
    },
    notes: {
      publicAPI:
        "Public API endpoints require x-api-key header with valid API key",
      hotelAPI:
        "Hotel API endpoints require Bearer token in Authorization header",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Event Info Demo API is running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}`);
  console.log(`📚 API documentation at http://localhost:${PORT}`);
});

module.exports = app;
