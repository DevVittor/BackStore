const router = require("express").Router();

router.use('/v1/api',require('./api/v1/'));
router.get("/",(req,res,next)=>{
    //res.send({ok:true});
    res.send("Funcionando!");
});

router.use((error,req,res,next)=>{
    if(error.name === 'ValidationError'){
        return res.status(422).json({
            errors:Object.keys(error.errors).reduce(function(errors,key){
                errors[key] = error.errors[key.message];
                return errors;
            },{})
        })
    }
});

module.exports = router; 