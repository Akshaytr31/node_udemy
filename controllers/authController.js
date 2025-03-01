// const crypto=require('crypto')
// const {promisify}=require('util')
// const jwt=require('jsonwebtoken')
// const User=require('./../models/userModel')
// const catchAsync=require('./../utils/catchAsync')
// const AppError=require('./../utils/appError')
// const sendEmail=require('./../utils/email')
// const { STATUS_CODES } = require('http')


// const signToken=id=>{
//     return jwt.sign({id},process.env.JWT_SECRET,{
//         expiresIn:process.env.JWT_EXPIRES_IN
//     })
// }

// const createSendToken=(user,statusCode,res)=>{
//     const token=signToken(user._id)
//     const cookieOptions={
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//     httpOnly:true
//     }
//     if(process.env.NODE_ENV==='production')cookieOptions.secure=true
//     res.cookie('jwt',token,cookieOptions)

//     res.status(statusCode).json({
//         status:'success',
//         token,
//         data:{
//             user
//         }
//     })
// }

// exports.signup=catchAsync(async (req, res, next)=>{
//     const newUser=await User.create({
//         name:req.body.name,
//         email:req.body.email,
//         password:req.body.password,
//         passwordConfirm:req.body.passwordConfirm
//     })

//     createSendToken(newUser,201,res)


// })


// exports.login=catchAsync(async(req,res,next)=>{
//     const {email,password}=req.body


//     if(!email||!password){
//         return next(new AppError('Please provide email and password!',400))
//     }

//     const user = await User.findOne({ email }).select('+password');

//     if(!user||!await user.correctPassword(password,user.password)){
//         return next(new AppError('Incorrect email or password',401))
//     }

//     createSendToken(user,200,res)





// })

// exports.protect = catchAsync(async (req, res, next) => {
//     let token;
    
//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         token = req.headers.authorization.split(' ')[1]; // ✅ Corrected extraction
//     }

//     if (!token) {
//         return next(new AppError('You are not logged in! Please log in to get access.', 401));
//     }

//     // Verify the token
//     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//     // Check if the user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//         return next(new AppError('The user belonging to this token no longer exists.', 401));
//     }

//     // Check if user changed password after token was issued
//     if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next(new AppError('User recently changed password! Please log in again.', 401));
//     }

//     // Grant access to the route
//     req.user = currentUser; // ✅ Fixed variable name
//     next();
// });

// exports.restrictTo=(...roles)=>{
//     return (req,res,next)=>{
//         //roles ['admon','lead-guide'].role='user'

//         if(!roles.includes(req.user.role)){
//             return next(new AppError('you do not have permission to perform this action ',403))
//         }
//         next()
//     }
// }
// exports.forgotPassword=catchAsync(async(req,res,next)=>{
// //get user based on posted email

// const user=await User.findOne({email:req.body.email})
// if(!user){
//     return next(new AppError('There is no user with email address.',404))
// }

// //generate the random reset token

// const resetToken =user.createPasswordResetToken()
// await user.save({validateBeforeSave:false})


// //send it to user's email
// const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

// const message=`Forgot your password ? Submit a PATCH request with your new password and
// passwordConfirm to:${resetURL}`


// try{
//     await sendEmail({
//         email:user.email,
//         subject:'Your password reset token (valid for 10 min)',
//         message
//     })
//     res.status(200).json({
//         status:'success',
//         message:'Token sent to email'
//     })
    
// }catch (err) {
//     console.error('Email sending error:', err); // Log the real error
    
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(new AppError('There was an error sending the email. Try again later.', 500));
// }


// })
// exports.resetPassword=catchAsync(async(req,res,next)=>{
//     //Get user based on  the token

//     const hashedtoken=crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex')

//     const user=await User.findOne({passwordResetToken:hashedtoken,
//     passwordResetExpires:{$gt:Date.now()}
//     })

//     // if token has not expired, and there is user ,set teh new password

//     if(!user){
//         return next (new AppError('Token is invalid or has expired',400))
//     }
//     user.password=req.body.password
//     user.passwordConfirm=req.body.passwordConfirm
//     user.passwordResetToken=undefined
//     user.passwordResetExpires=undefined
//     await user.save()

//     //update changedPassword property for the user

//     //Log the user in,send JWT
//     createSendToken(user,200,res)

 

// })

// exports.updatePassword=catchAsync(async(req,res,next)=>{
//     // get the user from the colloction?

//     const user=await User.findById(req.user.id).select('+password')

//     //check if posted current password is correct
//     if(!(await user.corre(req.body.passwordCurrent,user.password))){
//         return next(new AppError('Your current password is wrong.',401))
//     }


//     //if so ,update password
//     user.password=req.body.password
//     user.passwordConfirm=req.body.passwordConfirm
//     await user.save()

//     // log user send JWT
//     createSendToken(user,200,res)
// })



const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const { STATUS_CODES } = require('http');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Convert to number explicitly
    const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 10; 

    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000), 
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password=undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};



exports.signup = catchAsync(async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        if (err.code === 11000) {
            return next(new AppError('Email already in use. Please use a different email.', 400));
        }
        return next(err);
    }
});


exports.login = catchAsync(async (req, res, next) => {
    console.log('Login route hit');  // Debugging
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

exports.logout=(req,res)=>{

  res.cookie('jwt','loggedout',{
    expires:new Date(Date.now()+ 20*1000),
    httpOnly:true
  })
  res.status(200).json({status:'success'})
}


// exports.protect = catchAsync(async (req, res, next) => {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     } else if (req.cookies.jwt) {
//       token = req.cookies.jwt;
//     }
  
//     if (!token) {
//       return next(new AppError('You are not logged in! Please log in to get access.', 401));
//     }
  
//     // Verify token
//     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
//     // Check if user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return next(new AppError('The user belonging to this token no longer exists.', 401));
//     }
  
//     // Grant access to protected route
//     req.user = currentUser;
//     next();
//   });

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });


  // Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }
  
        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
  
        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };
  
  

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}`;
    try {
        await sendEmail({ email: user.email, subject: 'Your password reset token (valid for 10 min)', message });
        res.status(200).json({ status: 'success', message: 'Token sent to email' });
    } catch (err) {
        console.error('Email sending error:', err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
});

