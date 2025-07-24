const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongodb');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const classRoutes = require('./routes/classRouter');
const timetableRoutes = require('./routes/timetableRouter');

const app = express();

const allowedOrigins = ['http://localhost:5173']

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res) => {
  res.send('Welcome to FitFusion API');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
app.use('/class', classRoutes);
app.use('/timetable', timetableRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
      await connectDB(); // ⬅️ Wait for DB to connect
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exit(1); // Exit process if DB connection fails
    }
  };

startServer(); // ⬅️ Start the server after DB connection
