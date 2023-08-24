const router = require("express").Router();
const auth = require("../../auth.js");
const UserController = require("../../../UserController");

const User = new UserController();

router.get("/",auth.required,User.index);
router.get("/:id",auth.required,User.show);

router.post("/login", User.login);
router.post("/register", User.store);
router.put("/",auth.required, User.update);
router.detele("/",auth.required, User.remove);

router.get("/recovery-password", User.showRecovery);
router.post("/recovery-password", User.createRecovery);
router.get("/password-recovered", User.showcompleteRecovery);
router.post("/password-recovered", User.completeRecovery);

module.exports = router;