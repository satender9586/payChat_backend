const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL); 
    console.log(`✅ MongoDB connected: ${conn.connection.host}`.yellow);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
