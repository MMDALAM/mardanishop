const controller = require("app/http/controllers/controller");
const Factor = require("app/models/factor");
const Product = require("app/models/product");
const Clint = require("app/models/clint");
const Line = require("app/models/line");

class factorController extends controller {
  async showFactor(req, res, next) {
    try {
      const clints = await this.clints();
      const clint = await Clint.findOne({ name: "بدون نام" });

      res.render("admin/factor/factor", { clints, clint });
    } catch (err) {
      next(err);
    }
  }

  async factorProccess(req, res, next) {
    try {
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      let codeFactor = await this.codeFactor();

      const clints = await Clint.findOne({ name: req.body.name_clint });

      if (!clints) {
        req.flash("errors", " مشتری مورد نظر شما پیدا نشد ");
        return this.back(req, res);
      }

      const newFactor = new Factor({
        clint: clints._id,
        name_clint: clints.name,
        addresses: clints.addresses,
        phone: clints.phone,
        codeFactor: codeFactor,
      });
      await newFactor.save();

      let lastFactor = await Factor.findOne().sort({ createdAt: -1 });

      const priceTotal = await Factor.find({
        clint: clints.id,
        unpaid: false,
      });

      priceTotal.forEach(async (e) => {
        if (!(clints.id == e.clint)) {
          await Factor.findByIdAndUpdate(e.clint, {
            $set: { unpaid: true, debtor: true },
          });
        }
      });

      let prices = [];
      let pricess = 0;
      priceTotal.forEach((el) => {
        prices.push(el.priceTotal);
      });

      for (let i = 0; i < prices.length; i++) {
        pricess += prices[i];
      }

      let debtors = await Clint.findOne({ name: req.body.name_clint });

      const s = debtors.debtor + pricess;

      debtors.debtor = s;
      await debtors.save();

      priceTotal.forEach(async (el) => {
        await Factor.findByIdAndUpdate(el.id, {
          $set: { unpaid: true, debtor: true },
        });
      });

      if (clints.debtor > clints.creditor) {
        let debtor = clints.debtor - clints.creditor;
        clints.creditor = 0;
        clints.debtor = debtor;
        await clints.save();
      }

      if (clints.debtor < clints.creditor) {
        let creditor = clints.creditor - clints.debtor;
        clints.debtor = 0;
        clints.creditor = creditor;
        await clints.save();
      }
      return res.redirect(`/admin/createFactor/${lastFactor.id}`);
    } catch (err) {
      next(err);
    }
  }

  async createFactor(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let mainFactor = await Factor.findById(req.params.id);

      if (mainFactor === null) {
        return res.redirect("/admin");
      }

      const products = await this.products();

      let lines = await Line.find({ factor: mainFactor }).sort({
        createdAt: 1,
      });

      let price = [];
      let priceTotal = 0;
      lines.forEach((el) => {
        price.push(el.priceTotal);
      });

      for (let i = 0; i < price.length; i++) {
        priceTotal += price[i];
      }

      if (mainFactor.discount) {
        priceTotal -= mainFactor.discount;
        await Factor.findByIdAndUpdate(req.params.id, {
          $set: { priceTotal: priceTotal },
        });
      } else {
        await Factor.findByIdAndUpdate(req.params.id, {
          $set: { priceTotal: priceTotal },
        });
      }

      res.render("admin/factor/createFactor", {
        mainFactor,
        products,
        lines,
        priceTotal,
      });
    } catch (err) {
      next(err);
    }
  }

  async saveFactorProccess(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const lines = await Line.find({ factor: req.params.id });

      if (lines.length <= 0) {
        req.flash("errors", "لطفا محصولی را وارد کنید");
        return res.redirect(`/admin/createFactor/${req.params.id}`);
      }

      let lineAll = [];
      lines.forEach((el) => {
        lineAll.push(el.id);
      });

      await Factor.findByIdAndUpdate(req.params.id, {
        $set: { line: lineAll },
      });

      if (!(req.body.unpaid === undefined)) {
        await Factor.findByIdAndUpdate(req.params.id, {
          $set: { unpaid: !req.body.unpaid },
        });
      }

      lines.forEach(async (el) => {
        let products = await Product.findById(el.product);
        let amounts = 0;

        amounts = products.amount - el.cut;

        let pro = await Product.findById(el.product);
        pro.amount = amounts;
        return await pro.save();
      });

      const factorLoss = await Factor.findById(req.params.id);

      if (factorLoss.line === undefined) {
        req.flash(
          "errors",
          "فاکتور مورد نظر شما ذخیره نشد لطفا مجدد صدور کنید"
        );
        return res.redirect("/admin/factor");
      }

      const clints = await Clint.findById(factorLoss.clint);
      await Factor.findByIdAndUpdate(req.params.id, {
        $set: { debtorPrice: clints.debtor },
      });

      return res.redirect(`/admin/typeFactor/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }

  async discount(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const factors = await Factor.findById(req.params.id);

      if (!req.body.discount) {
        req.flash("errors", "پرداختی  را وارد کنید ");
        return res.redirect(`/admin/createFactor/${req.params.id}`);
      }

      if (req.body.discount > factors.priceTotal) {
        req.flash("errors", " مبلغ پرداختی بیشتر از قیمت کل است ");
        return res.redirect(`/admin/createFactor/${req.params.id}`);
      }

      await Factor.findByIdAndUpdate(req.params.id, {
        $set: { discount: parseInt(req.body.discount) },
      });

      return res.redirect(`/admin/createFactor/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }

  async typeFactor(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const factors = await Factor.findById(req.params.id);

      res.render("admin/factor/typeFactor", { factors });
    } catch (err) {
      next(err);
    }
  }

  async products(req, res) {
    const products = await Product.find();

    const productAll = [];
    products.forEach((el) => {
      productAll.push(el.name);
    });
    return productAll;
  }

  async clints(req, res) {
    const clints = await Clint.find();

    const clintAll = [];
    clints.forEach((el) => {
      clintAll.push(el.name);
    });
    return clintAll;
  }

  async singelFactor(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const factors = await Factor.findById(req.params.id);
      const lines = await Line.find({ factor: req.params.id });

      res.render("admin/factor/singelFactor", { factors, lines });
    } catch (err) {
      next(err);
    }
  }

  async deleteFactor(req, res, next) {
    this.isMongoId(req.params.id);
    const factor = await Factor.findById(req.params.id);
    const line = await Line.find({ factor: req.params.id });

    if (factor == null) {
      return res.redirect("/admin/factor");
    }

    line.forEach(async (el) => {
      await el.remove();
    });

    await factor.remove();
    return res.redirect("/admin/factor");
  }

  async deleteFactors(req, res, next) {
    this.isMongoId(req.params.id);
    const factor = await Factor.findById(req.params.id);
    const line = await Line.find({ factor: req.params.id });

    if (factor === null) {
      return res.redirect(`/admin/factorClint/${factor.clint}`);
    }

    if (line === null) {
      return res.redirect(`/admin/factorClint/${factor.clint}`);
    }

    line.forEach(async (el) => {
      await el.remove();
    });

    await factor.remove();
    return res.redirect(`/admin/factorClint/${factor.clint}`);
  }

  async printFactorLarge(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const factors = await Factor.findById(req.params.id);
      if (!factors) this.error("چنین فایلی برای این جلسه وجود ندارد ", 404);

      if (factors == null) {
        return res.redirect("/admin");
      }

      const lines = await Line.find({ factor: req.params.id });
      const clints = await Clint.findById(factors.clint);

      return res.render("admin/factor/printFactorLarge", {
        factors,
        lines,
        clints,
      });
    } catch (err) {
      next(err);
    }
  }

  async printFactorBig(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const factors = await Factor.findById(req.params.id);
      if (!factors) this.error("چنین فایلی برای این جلسه وجود ندارد ", 404);

      if (factors == null) {
        return res.redirect("/admin");
      }

      const lines = await Line.find({ factor: req.params.id });
      const clints = await Clint.findById(factors.clint);

      return res.render("admin/factor/printFactorBig", {
        factors,
        lines,
        clints,
      });
    } catch (err) {
      next(err);
    }
  }

  async printFactorSmall(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const factors = await Factor.findById(req.params.id);

      if (factors == null) {
        return res.redirect("/admin");
      }

      const lines = await Line.find({ factor: req.params.id });
      const clints = await Clint.findById(factors.clint);

      return res.render("admin/factor/printFactorSmall", {
        factors,
        lines,
        clints,
      });
    } catch (err) {
      next(err);
    }
  }

  async codeFactor() {
    const factorCode = await Factor.find();
    const newFactorCode = [];
    factorCode.forEach((el) => {
      newFactorCode.push(el.codeFactor);
    });
    let newFactorId;
    if (Math.max(...newFactorCode) + 1 > 999) {
      newFactorId = Math.max(...newFactorCode) + 1;
    } else {
      newFactorId = 1000;
    }
    return newFactorId;
  }
}

module.exports = new factorController();
