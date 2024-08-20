const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const util = require("util");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const fs = require("fs");
const https = require("https");

// Load environment variables
dotenv.config({ path: "./app/utils/config/config.env" });

// Connect to the database
require("./app/utils/config/database")();

// Initialize Express app
const app = express();
// Increase body-parser limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Dev log middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Enable CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Routes
app.get("/App", (req, res) => {
  res.json({ Tutorial: "Build FasTag REST API with Node.JS & MongoDB!!" });
});

const adminRoutes = require("./app/routes/admin.routes");
app.use("/v1/admin", adminRoutes);

const authRoutes = require("./app/routes/auth");
app.use('/v1/auth', authRoutes);

const agentRoutes = require("./app/routes/agent");
app.use("/v1/agent", agentRoutes);

const tlRoutes = require("./app/routes/teamLead.routes");
app.use("/v1/teamlead", tlRoutes);

const userRoutes = require("./app/routes/user");
app.use("/v1/user", userRoutes);

const bajaPayRoutes = require("./app/routes/bajajpayfast.routes");
app.use("/v1/bajapayfastag", bajaPayRoutes);

const projectRoutes = require("./app/routes/project.routes");
app.use('/v1/project', projectRoutes);

// fastagAllocation Routes 
const fastagAllocationRoutes = require('./app/routes/fastagAllocation.routes')
app.use('/v1/fastag',fastagAllocationRoutes);

// Apply cards Routes
const applyCardRoutes = require('./app/routes/applyCard.routes');
app.use('/v1/applycards',applyCardRoutes);

/**
 * Handling 404, 500 Errors
 */
app.use(function (err, req, res, next) {
  if (err.status === 404)
    res.status(404).json({
      message: "Not found",
    });
  else
    res.status(500).json({
      message: "Internal Server Error",
      err: util.inspect(err),
    });
});

// // Serve static files
// app.use(express.static(path.join(__dirname, "build")));

// // Serve index.html for the root route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "app/adminpanel/index.html"));
// });

// // Serve index.html for all other routes (Angular routes)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "app/adminpanel/index.html"));
// });

// SSL options
const sslOptions = {
  key: fs.readFileSync('./app/utils/config/ssl/privkey.pem'),
  cert: fs.readFileSync('./app/utils/config/ssl/fullchain.pem')
};

// Create HTTPS server
const PORT = process.env.PORT || 5050;
const server = https.createServer(sslOptions, app);

server.listen(PORT, () => {
  console.log(`${process.env.NODE_ENV} Application running at https://localhost:${PORT}`.yellow.bold);
});
