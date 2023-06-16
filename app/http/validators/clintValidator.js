const validator = require("./validator");
const { body } = require("express-validator");

class clintValidator extends validator {
  handle() {
    return [
      body("name").not().isEmpty().withMessage("لطفا دقت کنید نام خالی است"),

      body("addresses")
        .not()
        .isEmpty()
        .withMessage("لطفا دقت کنید آدرس خالی است"),

      body("phone")
        .not()
        .isEmpty()
        .withMessage("لطفا دقت کنید شماره تلفن خالی است"),
    ];
  }
}

module.exports = new clintValidator();
