import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected!');
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
