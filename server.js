const express = require("express");
const bodyparser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan  = require("morgan");
const app = express();
//require("./models");

//require('dotenv').config();

const dbs = require("./config/database.json");
const isProduction = process.env.NODE_ENV === 'production';
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI,{useNewUrlParser:true});

if(!isProduction){
    app.use(morgan("dev"));
};
app.use(cors());
app.disable('x-powered-by');
app.use(compression());

app.set("view engine ", "ejs");
app.use(express.static('public'))

app.use(bodyparser.json({limit:1.5*1024*1024}));
app.use(bodyparser.urlencoded({extended:false,limit:1.5*1024*1024}));

//app.use("/",require("./routes"));

process.env.NODE_ENV = 6;

//Error 404
app.use((req,res,next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})
//Error 422,500,401
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    if(error.status != 400){
        console.warn("Error",error.message,new Date());
        res.json({erros:{message: error.message,status:error.status}});
    }
});

const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`);
});