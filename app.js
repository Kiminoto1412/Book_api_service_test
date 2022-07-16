const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");

const bookRoute = require("./routes/bookRoute");

// ----------------------------- Sync to create database -----------------------------
// const { sequelize } = require("./models/index");
// sequelize.sync({ force: true });
// sequelize.sync({ alter: true });
// ----------------------------- Sync to create database -----------------------------

//book
app.use("/books", bookRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => console.log(`\n\n\nRunning port ${port}`));
