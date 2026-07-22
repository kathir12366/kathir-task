const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM employees";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.post("/employees", (req, res) => {
  const { name, email, department } = req.body;

  const sql =
    "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)";

  db.query(sql, [name, email, department], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Employee added successfully",
      id: result.insertId,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
