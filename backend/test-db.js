const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const uri = process.env.MONGO_URI;

(async () => {
  try {
    console.log('Testing MongoDB connection...');
    const conn = await mongoose.connect(uri, { connectTimeoutMS: 10000 });
    console.log('Connected!', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection test failed:');
    console.error(err);
    process.exit(1);
  }
})();
