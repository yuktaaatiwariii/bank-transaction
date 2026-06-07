const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');


// user register - POST - /api/auth/register

async function  userRegisterController(req,res){

    const {name,email,password} = req.body;

    const isExists = await userModel.findOne({email:email});
    if(isExists){
        return res.status(400).json({
            message:"User already exists",
            status:"failed"
        })
    }

    const user= await userModel.create({
        name:name,
        email:email,
        password:password
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
    res.cookie('token',token).status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        message:"User registered successfully",
        status:"success",
        token:token
    });
    await emailService.sendRegistrationEmail(user.email, user.name);
}

// user login - POST - /api/auth/login

async function userLoginController(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email:email}).select('+password');
    if(!user){
        return res.status(400).json({
            message:"Invalid credentials",
            status:"failed"
        })
    }

    const isValidPassword = await user.comparePassword(password);

     if(!isValidPassword){
        return res.status(400).json({
            message:"Invalid credentials",
            status:"failed"
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
    res.cookie('token',token).status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name  
        },
        message:"User logged in successfully",
        status:{statusCode:200 , statusText:"success"},
        token:token

    });
}

// user logout - POST - /api/auth/logout

async function userLogoutController(req,res){   
    res.clearCookie('token').status(200).json({
        message:"User logged out successfully",
        status:"success"
    });
}   

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}
