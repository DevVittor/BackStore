const router = require("express").Router();

router.use("/users",require("./Users"));

module.exports = router;