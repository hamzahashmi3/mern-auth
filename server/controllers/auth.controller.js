
const userModel = require("../models/user.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");   
// sendgrid
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require('nodemailer');

// exports.signup = (req, res)=>{
//     //     console.log("requesrt body on signup", req.body);
//     //     res.json({
//     //         data:"you hit the signup endpoint."
//     //     })
//     const { name, email, password } = req.body;

//     userModel.findOne({email}).exec((error, user) => {
//         if(user){
//             return res.status(400).json({
//                 error:"email is already registered."
//             })
//         }
//     })
//     let newUser = new User({name, email, password})

//     newUser.save((err, success)=> {
//         if(err){
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         res.json({
//             message: "signup success! please signIn",
//             user:newUser
//         })
//     })
// }

  


exports.signup=(req, res)=>{
    const {name, email, password} = req.body;

    userModel.findOne({email}).exec((err, user)=>{
        if(user){
            return res.status(400).json({
                error: "Email is taken"
        })
    }
    });
    const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: "10m"});

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hamzahashmi.office@gmail.com',
          pass: 'Hashmi.007'
        }
      });

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Signup succeeded",
        html: `
            <h1>Please use the Following link to Activate your account.</h1>
            <p>${process.env.CLIENT_URL}/auth/activate${token}</p>
            <hr/>
            <p>this email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `}
      
      transporter.sendMail(emailData, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    // const emailData = {
    //     from: process.env.EMAIL_FROM,
    //     to: email,
    //     subject: "Signup succeeded",
    //     html: `
    //     <h1>Please use the Following link to Activate your account.</h1>
    //     <p>${process.env.CLIENT_URL}/auth/activate${token}</p>
    //     <hr/>
    //     <p>this email may contain sensitive information</p>
    //     <p>${process.env.CLIENT_URL}</p>
    //     `}
    //     sgMail.send(emailData).then(()=>{
    //         console.log("email sent");
    //         res.json({
    //             message: `A verification email has been sent to ${email}.Follow the instructions to activate your account.`
    //         })
    //     })
    //     .catch(err=>{
    //         console.log("error sending email", err);
    //         res.json({
    //             message: err.message
    //         })
    //     })
}

exports.accountActivation = (req, res)=>{
    const {token} = req.body;
    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded)=>{
            if(err){
                return res.status(401).json({
                    error: "Expired link. Signup again"
                })
            }
            const {name, email, password} = jwt.decode(token);
            const user = new user({name, email, password});
            user.save((err, user)=>{
                if(err){
                    return res.status(401).json({
                        error: "Error saving user in database"
                    })
                }
                return res.json({
                    message: "Signup successful. Please login to continue"
                })
            })
        }
        )
    }
    else{
        return res.status(401).json({
            error: "Something went wrong. Try again"
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
};