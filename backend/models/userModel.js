const mongoose=require("mongoose");
const bycrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:[true,"first name is required"],
        maxlength:32
    },
    lastName:{
        type:String,
        trim:true,
        required:[true,"last name is required"],
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        match:[ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please add a valid email"]
    },
    password:{
        type:String,
        tirm:true,
        required:[true,"Password is required"],
        minlength:[6,"password must at leaset six characters"]
    },
    role:{
        type:Number,
        default:0
    }
},{timestamps:true});
//encryption a password before saving
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bycrypt.hash(this.password,10);
});
//compare user password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bycrypt.compare(enteredPassword,this.password);
}
//return a jtw token
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:3600
    });
}
const User=mongoose.model("User",userSchema);
module.exports=User;