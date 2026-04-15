import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedMongoose | undefined;
}

const cached: CachedMongoose = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const connectPromise = mongoose.connect(MONGODB_URI as string, {
      dbName: "mysarah_corp",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 8000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
      retryWrites: true,
      retryAttempts: 1,
    });

    // Add additional timeout safety net
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("MongoDB connection timeout exceeded 8 seconds")), 8000)
    );

    cached.promise = Promise.race([connectPromise, timeoutPromise]);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
