require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const morgan = require("morgan");

const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
// const roomModel = require("./models/room");
// const roomsData = require("./roomsData.json");

const roomRouter = require("./routes/roomRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const bookingRouter = require("./routes/bookingRoutes");

//middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/notFound");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);

app.get("/", (req, res) => {
  res.send("SERVER IS LISTENING...");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("connected to db..");
    // ---populating the database with data---
    // await roomModel.deleteMany();
    // await roomModel.create(roomsData);
    // process.exit(0);
    app.listen(port, () => console.log(`server listening on port ${port}...`));
  } catch (error) {
    console.log("error while starting", error);
    // process.exit(1);
  }
};

start();
