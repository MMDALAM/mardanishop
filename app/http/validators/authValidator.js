const validator = require("./validator");
const { body } = require("express-validator");

class authValidator extends validator {
  handle() {
    return [
      body("username")
        .not()
        .isEmpty()
        .withMessage("لطفا دقت کنید نام کاربری خالی است"),

      body("password")
        .isLength({ min: 1 })
        .withMessage("پسورد باید بیشتر از 5 عدد باشد"),
    ];
  }
}

module.exports = new authValidator();
