import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect('mongodb+srv://varun73patil:varunchutiya@cluster0.mk5dl7k.mongodb.net/newData', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

export default connectDb;
