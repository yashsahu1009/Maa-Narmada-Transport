import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maa_narmada_transport';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`MongoDB Connection Warning: ${err.message}`);
    console.log(`Falling back to resilient memory/file storage mode for uninterrupted operation.`);
    return false;
  }
}
