const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendEmailRecovery = require("../helpers/email-recovery");

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

        if(!name || !email) return res.status(422).json({error:"Preencha todos os campos de cadastro"});

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
            if(!user.validatePassword(password)) res.status(401).json({errors:"Senha inválida"});
            return res.json({user:user.sendAuthJSON()});
        }).catch(next);
    }

    showRecovery(req,res,next){
        return res.render('recovery',{error:null,success:null});
    }

    createRecovery(req,res,next){
        const {email} = req.body;
        if(!email) return res.render('recovery',{error:"Preencha com o seu email",success:null});
        User.findOne({email})
        .then((user=>{
            if(!user) return res.render("recovery",{error:"Não existe usuário com esse email",success:null});
            const recoveryData =  User.createPasswordRecoveryToken();
            return user.save()
            .then(()=>{
                return res.render("recovery",{error:null,success:true});
            }).catch(next)
        })).catch(next)
    }

    showcompleteRecovery(req,res,next){
        if(!req.query.token) return res.render("recovery",{error:"Token não identificado",success:null});
        User.findOne({"recovery.token":req.query.tolen})
        .then(user=>{
            if(!user) return res.render("recovery",{error:"Não existe usuário com esse Token",success:null});
            if(new Date(user.recovery.date) < new Date()) return res.render("recovery",{error:"Token expirado. Tente novamente",success:null});
            return res.render("recovery/store",{error:null,success:null,token:req.query.token});
        }).catch(next);
    }

    completeRecovery(req,res,next){
        const {token,password} = req.body;
        if(!token || !password) return res.render("recovery/store",{error:"Preencha novamente com a sua nova senha",success:null,token:token});
        User.findOne({"recovery.token":token})
        .then(user=>{
            if(!user)return res.render("recovery",{error:"Usuário não identificado",success:null});
            user.finalizePasswordRecoveryToken();
            user.setPassword(password);
            return user.save()
            .then(()=>{
                return res.render("recovery/store",{
                    error:null,
                    success:"Senha alterada com sucesso tente fazer login novamente ",
                    token:null
                });
            }).catch(next)
        })
    }

}