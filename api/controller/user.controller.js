import Listing from "../modles/listing.model.js";
import User from "../modles/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'


export const test =(req , res)=>{
    res.json({
        message:"hlo"
    });
};
export const updateUserInfo =async (req , res , next)=>{
if(req.user.id!==req.params.id) return next(errorHandler(401  , "update your own account"))
try {
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        avatar:req.body.avatar,
        }
    },{new:true})
    const{password ,...rest} =updateUser._doc
    res.status(200).json(rest); 
} catch (error) {
    next(error)
    console.log(error);
}
}
export const deleteUser = async (req , res , next)=>{
    if(req.user.id!=req.params.id) return next(errorHandler(401 , 'You can only delete your account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('user deleted successfully');
    } catch (error) {
        next(error)
    }
}
export const getUserListing = async(req , res , next)=>{
   if(req.user.id===req.params.id){
    try {
        const listing = await Listing.find({UserRef:req.params.id})
        res.status(200).json(listing);
    } catch (error) {
        
    }

   }else{
    return next(errorHandler(401 , 'only voew your own listing'))
   }
}