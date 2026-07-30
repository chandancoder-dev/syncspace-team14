import mongoose from "mongoose";
import dns from "node:dns";

// Use public DNS servers to resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

function dbConnect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e));
}

export default dbConnect;