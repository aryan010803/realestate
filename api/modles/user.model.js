import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required :true,
        unique: true,
    },
    email:{
        type: String,
        required :true,
        unique: true,
    },
    password: {
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnnU0UsNL-iNHamaoWV-CkMgNYmjpEK4BGv1kUoAJZCw&s"
    },

},{timestamps:true});
const User  = mongoose.model('User' , userSchema);
export default User;