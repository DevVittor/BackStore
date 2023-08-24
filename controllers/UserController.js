const mongoose =require("mongoose");
const User  =mongoose.model("User");
const  sendEmailRecovery = require("../helpers/email-recovery");

class UserController{

    //Get / 
    index(req,res,next){
        User.findById(req,payload.id)
        .then(user=>{
            if(!user) return res.status(401).json({erros:"Usuário não registrado"});
            return res.json({user:user.sendAuthJSON()});
        }).catch(next);
    }

    //GET /:id
    show(req,res,next){
        User.findById(req,params.id).populate({path:"store"})
        .then(user=>{
            if(!user) return res.status(401).json({errors:"Usuário não registrado"});
            return res.json({
                user:{
                    name:user.name,
                    email:user.email,
                    permission: user.permission,
                    store:user.store
                }
            });
        }).catch(next);
    }

    store(req,res,next){
        const {name,email,password} = req.body;
        const user = new User({name,email});
        user.setPassword(password);
        
        user.save()
        .then(()=>{
            res.json({user:user.sendAuthJSON()});
        }).catch(next);
    }

    update(req,res,next){
        const {name,email,password} = req.body
        User.findById(req.payload.id)
        .then((user)=>{
            if(!user) return res.status(401).json({errors:"Usuário não registrado"});
            if(typeof name !== "undefined") user.name = name;
            if(typeof email !== "undefined") user.email = email;
            if(typeof password !== "undefined") user.setPassword(password);
            return user.save().then(()=>{
                return res.json({user:user.sendAuthJSON()});
            }).catch(next);
        }).catch(next);
    }

    remove(req,res,next){
        User.findById(req.payload.id)
        .then(user=>{
            if(!user) return res.status(401).json({errors:"Usuário não registrado"});
            return user.remove()
            .then(()=>{
                res.json({delete: true});
            }).catch(next)
        }).catch(next);
    }

    login(req,res,next){
        const {email,password} = req.body;
        if(!email) return res.status(422).json({errors:{email:"Não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors:{password:"Não pode ficar vazio"}});
        User.findOne({email})
        .then((user)=>{
            if(!user) res.status(422).json({errors:{email:"Usuário não cadastrado"}});
            if(!user.validatePassword(password)) res.status(401).json({errors:{password:"Senha inválida"}});
            return res.json({user:user.sendAuthJSON()});
        }).catch(next);
    }

}