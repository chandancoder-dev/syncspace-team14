import mongoose from "mongoose";

function dbConnect() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e));
}

export default dbConnect;