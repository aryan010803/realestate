import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import UserRouter from './routes/user.route.js'
import authRouter  from './routes/auth.route.js'
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
const app = express();
app.use(express.json());
app.listen(3000 ,()=>{
    console.log("running");
})
app.use('/api/user' , UserRouter);
app.use('/api/auth' , authRouter);