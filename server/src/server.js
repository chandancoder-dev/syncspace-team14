import dotenv from "dotenv";
import app from "./app.js";
import express from "express";
import mongoose from "mongoose"
import userRouter from "../routers/routes.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/syncspaceDB")
.then(()=> console.log("db connected"))


app.use("/api",userRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});