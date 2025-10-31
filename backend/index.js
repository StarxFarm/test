import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import produkRoutes from "./routes/user.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", produkRoutes);

// Test koneksi DB
app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        res.send({ message: "Database connected", result: rows[0].result });
    } catch (err) {
        res.status(500).send("Database connection error: " + err.message);
    }
});


// Port tetap 5001 biar nggak bentrok
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
