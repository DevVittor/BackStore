const multer = require("multer");

const storage = multer.diskStorage({
    destination:(req,file,callback)=>callback(null,__dirname + '../public/imgs'),
    filename:(req,file,callback)=>callback(null,file.fieldname + '-' + Date.now() + '.webp'),
});

const upload = multer({storage})

module.export = upload;