const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
exports.signUp = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorResponse("Email already exist", 400));
  }
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
exports.signIn=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        if(!email){
            return next(new ErrorResponse("Please provide an email",403));
        }
        if(!password){
            return next(new ErrorResponse("Please provide an password",403));
        }
        const user=await User.findOne({email});
        if(!user){
            return next(new ErrorResponse("Invalid credentials",400));
        }
        const isMatched=await user.comparePassword(password);
        if(!isMatched){
            return new ErrorResponse("Invalid credentials",400);
        }
        sendTokenResponse(user,200,res);
    } catch (error) {
       next(error); 
    }
}
const sendTokenResponse=async(user,statusCode,res)=>{
    const token=await user.getJwtToken();
    res.status(statusCode).cookie("token",token,{maxAge:60*60*1000,httpOnly:true})
    .json({success:true,token,user});   
}
exports.signOut=async(req,res,next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success:true,
        message:"logged out"
    });
}