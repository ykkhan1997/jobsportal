const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const morgan=require("morgan");
const cookieParser=require("cookie-parser");
const errorHandler=require("./middleware/error");
const authRouters=require("./routes/authroutes");
const dotenv=require("dotenv");
dotenv.config();
const app=express();


//middle ware
app.use(morgan("dev"));
app.use(express.json({limit:"5mb"}));
app.use(express.json({limit:"5mb",extended:true}));
app.use(cookieParser());
app.use(cors());
app.use("",authRouters);
app.use(errorHandler);
const port=process.env.PORT ||3000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(port,()=>{
        console.log(`Database is connected & Your port is running on port ${port}`)
    });
}).catch((error)=>{
    console.log({message:error.message});
});