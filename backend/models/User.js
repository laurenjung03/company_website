const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      select: false,
      //쿼리 결과에서 빠지도록 select:false
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
      //동시 로그인 방지
    },
    isActive: {
      //비밀번호 틀리면 계정 잠금
      type: Boolean,
      default: true,
    },
    failedLoginAttempt: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
//이걸 외부에서 쓸수있도록 export 하기
const User = mongoose.model("User", userSchema);
module.exports = User;

//new mongoose.Schema({username:{}, password:{},}) 이런식인건가

// const mongoose= require("mongoose")

// const userSchema2= new mongoose.Schema({
//     username:{
//         type:String,
//         required:true,
//         trim:true
//     }, password:{
//         type:String,
//         select:false,
//         minlength:2,
//         maxlength:20,

//     }, isLoggedIn:{
//         type:Boolean,
//         default:false
//     },
//     isActive:{
//         type:Boolean,
//         default:false
//     },
//     failedLoginAttempt:{
//         type:Number,
//         default:0,
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now,
//     },
// },{timestamps:true})
