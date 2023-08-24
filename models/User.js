const mongoose =require("mongoose"),
    Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt  =require("jsonwebtoken");
const secret = require("../config").secret;

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"não pode ficar vazio!"]
    },
    email: {
        type: String,
        lowercase:true,
        unique: true,
        required:[true,"não pode ficar vazio!"],
        index:true,
        match:[/\S+@\S+\.\S+/, 'É inválido']
    },
    store:{
        type: Schema.Types.ObjectId,
        ref:"Store",
        required:[true,"não pode ficar vazia"],
    },
    permission:{
        type:Array,
        default:["client"]
    }, 
    hash:String,
    salt:String,
    recovery:{
        type:{
            token:String,
            date:Date
        },
        default:{}
    }
},{timestamps:true})

UserSchema.plugin(uniqueValidator,{ message:"Já está sendo utilizado" });

UserSchema.methods.setPassword = (password)=>{
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password,this.salt,10000,512,"sha512").toString("hex");
};

UserSchema.methods.validatePassword = (password)=>{
    const hash = crypto.pbkdf2Sync(password,this.salt,10000,512, "sha512").toString("hex");
    return hash === this.hash;
};

UserSchema.methods.generateToken = ()=>{
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate()+15);

    return jwt.sign({
        id:this._id,
        email:this.email,
        name:this.name,
        exp:parseFloat(exp.getTime() / 1000,10)
    },secret);
};

UserSchema.methods.sendAuthToken= ()=>{
    return{
        name:this.name,
        email:this.email,
        store:this.store,
        role:this.permission,
        token: this.generateToken()
    };
};

//Recovery 

UserSchema.methods.createPasswordRecoveryToken = ()=>{
    this.recovery = {},
    this.recovery.token = crypto.randomBytes(16).toString("hex");
    this.recovery.date = new Date(new Date().getTime()+ 24*60*60*1000);
    return this.recovery
};

UserSchema.methods.finalizePasswordRecoveryToken = ()=>{
    this.recovery = {token: null,date:null};
    return this.recovery;
};

module.exports = mongoose.model("User",UserSchema)