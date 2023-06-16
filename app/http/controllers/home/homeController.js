const controller = require("app/http/controllers/controller");
const passport = require("passport");

class homeController extends controller {
  async index(req, res, next) {
    try {
      res.render("home/auth");
    } catch (err) {
      next(err);
    }
  }

  // async authProccess(req, res, next) {
  //   try {
  //     let result = await this.validationData(req, res, next);
  //     if (result) return this.loginProccess(req, res, next);
  //     return this.back(req, res);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async loginProccess(req, res, next) {
  //   await passport.authenticate("local.login", {
  //     successRedirect: "/admin",
  //     failureRedirect: "/",
  //     failureFlash: true,
  //   })(req, res, next);
  // }
}

module.exports = new homeController();
