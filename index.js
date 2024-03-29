import express from "express"
import cors from 'cors'
import connectDb from "./config/db.js";
import dotenv from 'dotenv';
import adsRouter from "./routes/adsRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config()
const port = process.env.PORT || 8000;

connectDb();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use('/ads', adsRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running');
})