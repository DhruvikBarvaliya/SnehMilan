const express = require("express");
const router = express.Router();
const authorize = require('../Middleware/auth');
const Role = require("../Helpers/role");
const UserController = require("../Controllers/UserController");

router.post("/user", authorize([Role.ADMIN, Role.SUPER_ADMIN]), UserController.addUser);
router.get("/user", UserController.getAllUser);
router.get("/user/:user_id", authorize([Role.ADMIN, Role.SUPER_ADMIN,Role.EMPLOYEE]), UserController.getUserById);
router.put("/user/:user_id", authorize([Role.ADMIN, Role.SUPER_ADMIN,Role.EMPLOYEE]), UserController.updateUser);
router.put("/user/:user_id/:status", authorize([Role.ADMIN, Role.SUPER_ADMIN]), UserController.updateUserStatus);
router.delete("/user/:user_id", authorize([Role.ADMIN, Role.SUPER_ADMIN]), UserController.deleteUser);
router.delete("/user", authorize([Role.ADMIN, Role.SUPER_ADMIN]), UserController.deleteAllUser);

module.exports = router;
