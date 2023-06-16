const express = require("express");
const router = express.Router();

//controller
const homeController = require("app/http/controllers/home/homeController");
const adminController = require("app/http/controllers/admin/adminController");

//Validator
const authValidator = require("app/http/validators/authValidator");

//Admin Routes
router.get("/", adminController.showAdmin);

//auth Routes
// router.post("/auth", authValidator.handle(), homeController.authProccess);

module.exports = router;
