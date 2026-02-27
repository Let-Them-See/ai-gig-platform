const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // primary URI (Atlas) from environment
    const primaryUri = process.env.MONGO_URI;
    // fallback local URI
    const fallbackUri = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/ai_gig_platform';

    // attempt primary connection with a short timeout
    try {
      const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 10000 });
      console.log("MongoDB Connected Successfully! (primary)");
      console.log("Host:", conn.connection.host);
      return;
    } catch (primaryErr) {
      console.warn('Primary MongoDB connection failed, attempting fallback local MongoDB...');
      console.warn(primaryErr.message);
    }

    // attempt fallback local MongoDB
    const conn2 = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB Connected Successfully! (fallback)");
    console.log("Host:", conn2.connection.host);

  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
