import User from "../modles/user.model.js";
import  bcryptjs from 'bcryptjs'

export const signup = async(req , res,next)=>{
    // console.log(req.body);
    const {username  , email , password}  = req.body;
    const hashed  = bcryptjs.hashSync(password , 10);
    const newUser = new User({username , email , password:hashed});
    try {
        await newUser.save()
        res.status(201).json("user created successfully");
        
    } catch (error) {
      next(error);
    }

}