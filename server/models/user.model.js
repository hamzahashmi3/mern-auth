const mongoose = require("mongoose");
const crypto = require("crypto");
const { stringify } = require("querystring");

// schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        require: true,
        max: 32
    },
    email:{
        type: String,
        trim: true,
        require: true,
        unique: true,
        lowercase: true
    },
    hashedPassword:{
        type: String,
        trim: true,
        require: true,
        max: 32
    },
    salt:String,
    verifird:Boolean,
    role:{
        type:String,
        default:"subscriber"
    },
    resetPasswordLink:{
        data: String,
        default: ""
    }
},{timeStamps:true})


// virtuals

userSchema.virtual("password")
.set(function(password){
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password)
})
.get(function(){
    return this._password;
})
// methods

userSchema.methods = {
    authenticate : function(plainText){
        return this.encryptPassword(plainText) === this.hashedPassword
    },
    encryptPassword : function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                    
            // updating data
            .update(password)
            // Encoding to be used
            .digest('hex');

        } catch (error) {
            return ""
        }
    },
    makeSalt : function(){
        return Math.round(new Date().valueOf() * Math.random()) + ""
    }
}

module.exports = mongoose.model("User", userSchema)