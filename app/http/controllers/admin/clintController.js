const controller = require("app/http/controllers/controller");
const Clint = require("app/models/clint");
const Factor = require("app/models/factor");
const Debtor = require("app/models/debtor");
const Creditor = require("app/models/creditor");
const Line = require("app/models/line");

class clintController extends controller {
  async showClint(req, res, next) {
    try {
      res.render("admin/clint/clint");
    } catch (err) {
      next(err);
    }
  }

  async creatClient(req, res, next) {
    try {
      res.render("admin/clint/creatClient");
    } catch (err) {
      next(err);
    }
  }

  async clintProccess(req, res, next) {
    try {
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      if (req.body.debtor && req.body.creditor) {
        req.flash("errors", "نمیتوانید هم بدکاری هم بستانکاری وارد کنید");
        return this.back(req, res);
      }

      const newClint = new Clint({
        name: req.body.name,
        addresses: req.body.addresses,
        phone: req.body.phone,
        debtor: req.body.debtor || 0,
        creditor: req.body.creditor || 0,
      });

      try {
        await newClint.save();
        req.flash("errors", " مشتری مورد نظر شما ذخیره شد ");
        return this.back(req, res);
      } catch (err) {
        if (err.code == 11000) {
          req.flash("errors", " مشتری با این نام قبلا ثبت شده است ");
          return this.back(req, res);
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async clints(req, res, next) {
    try {
      const clints = await Clint.find().sort({ createdAt: -1 });

      res.render("admin/clint/clints", { clints });
    } catch (err) {
      next(err);
    }
  }

  async clintsCreditor(req, res, next) {
    try {
      const clints = await Clint.find().where("creditor").gt(1).sort({
        createdAt: -1,
      });

      res.render("admin/clint/clintsCreditor", { clints });
    } catch (err) {
      next(err);
    }
  }

  async factorClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const fac = await Factor.find({ clint: req.params.id });

      let facs = [];
      fac.forEach(async (el) => {
        facs.push(el.line);
        if (el.line === undefined) {
          await Factor.findByIdAndDelete(el.id);
        }
      });

      const factors = await Factor.find({ clint: req.params.id }).sort({
        createdAt: -1,
      });

      if (factors === null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const priceTotal = await Factor.find({
        clint: req.params.id,
        unpaid: false,
      });

      let prices = [];
      let pricess = 0;
      priceTotal.forEach((el) => {
        prices.push(el.priceTotal);
      });

      for (let i = 0; i < prices.length; i++) {
        pricess += prices[i];
      }

      let name_clint = await Clint.findById(req.params.id);

      if (name_clint == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const s = name_clint.debtor + pricess;

      name_clint.debtor = s;
      await name_clint.save();

      const unpaids = await Factor.find({
        clint: req.params.id,
        unpaid: false,
      });

      unpaids.forEach(async (el) => {
        el.unpaid = true;
        el.debtor = true;
        await el.save();
      });

      if (name_clint.debtor > name_clint.creditor) {
        let debtor = name_clint.debtor - name_clint.creditor;
        name_clint.creditor = 0;
        name_clint.debtor = debtor;
        await name_clint.save();
      }

      if (name_clint.debtor < name_clint.creditor) {
        let creditor = name_clint.creditor - name_clint.debtor;
        name_clint.debtor = 0;
        name_clint.creditor = creditor;
        await name_clint.save();
      }

      res.render("admin/clint/factorClint", {
        factors,
        name_clint,
      });
    } catch (err) {
      next(err);
    }
  }

  async factorClintCreditor(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const fac = await Factor.find({ clint: req.params.id });

      let facs = [];
      fac.forEach(async (el) => {
        facs.push(el.line);
        if (el.line === undefined) {
          await Factor.findByIdAndDelete(el.id);
        }
      });

      const factors = await Factor.find({ clint: req.params.id }).sort({
        createdAt: -1,
      });

      if (factors === null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const priceTotal = await Factor.find({
        clint: req.params.id,
        unpaid: false,
      });

      let prices = [];
      let pricess = 0;
      priceTotal.forEach((el) => {
        prices.push(el.priceTotal);
      });

      for (let i = 0; i < prices.length; i++) {
        pricess += prices[i];
      }

      let name_clint = await Clint.findById(req.params.id);

      if (name_clint == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const s = name_clint.debtor + pricess;

      name_clint.debtor = s;
      await name_clint.save();

      const unpaids = await Factor.find({
        clint: req.params.id,
        unpaid: false,
      });

      unpaids.forEach(async (el) => {
        el.unpaid = true;
        el.debtor = true;
        await el.save();
      });

      if (name_clint.debtor > name_clint.creditor) {
        let debtor = name_clint.debtor - name_clint.creditor;
        name_clint.creditor = 0;
        name_clint.debtor = debtor;
        await name_clint.save();
      }

      if (name_clint.debtor < name_clint.creditor) {
        let creditor = name_clint.creditor - name_clint.debtor;
        name_clint.debtor = 0;
        name_clint.creditor = creditor;
        await name_clint.save();
      }

      res.render("admin/clint/factorClintCreditor", {
        factors,
        name_clint,
      });
    } catch (err) {
      next(err);
    }
  }

  async debtorClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const debtors = await Debtor.find({ clint: req.params.id });
      const creditors = await Creditor.find({ clint: req.params.id });

      if (creditors == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      if (debtors == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const name_clint = await Clint.findById(req.params.id);

      if (name_clint == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return res.redirect("/admin/clints");
      }

      res.render("admin/clint/debtorClint", { creditors, debtors, name_clint });
    } catch (err) {
      next(err);
    }
  }

  async creditorClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const creditors = await Creditor.find({ clint: req.params.id });

      if (creditors == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return this.back(req, res);
      }

      const name_clint = await Clint.findById(req.params.id);

      if (name_clint == null) {
        req.flash("errors", "مشتری مورد نظر پیدا نشد");
        return res.redirect("/admin/clints");
      }

      res.render("admin/clint/creditorClint", { creditors, name_clint });
    } catch (err) {
      next(err);
    }
  }

  async paymentReceipt(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const debtors = await Debtor.findById(req.params.id);
      const clints = await Clint.findOne({ _id: debtors.clint });

      if (debtors == null) {
        return res.redirect("/admin");
      }

      return res.render("admin/factor/paymentReceipt", { debtors, clints });
    } catch (err) {
      next(err);
    }
  }

  async paymentDebtorClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const clints = await Clint.findById(req.params.id);

      res.render("admin/clint/paymentDebtorClint", { clints });
    } catch (err) {
      next(err);
    }
  }

  async debtorClintProccess(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const clints = await Clint.findById(req.params.id);

      const newDebtor = new Debtor({
        clint: clints._id,
        name_clint: clints.name,
        debtor_clint: clints.debtor,
        type: req.body.type,
        amount_debtor: req.body.amount_debtor,
        receipt_payment: req.body.receipt_payment,
        description: req.body.description,
      });

      if (req.body.amount_debtor > clints.debtor) {
        req.flash("errors", " مبلغ وارد شده بیشتر از بدهی است ");
        return this.back(req, res);
      }

      let s = clints.debtor - req.body.amount_debtor;
      clints.debtor = s;
      await clints.save();
      await newDebtor.save();
      return res.redirect("/admin/clints");
    } catch (err) {
      next(err);
    }
  }

  async paymentCreditorClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const clints = await Clint.findById(req.params.id);

      res.render("admin/clint/paymentCreditorClint", { clints });
    } catch (err) {
      next(err);
    }
  }

  async creditorClintProccess(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const clints = await Clint.findById(req.params.id);

      const newCreditor = new Creditor({
        clint: clints._id,
        name_clint: clints.name,
        type: req.body.type,
        amount_creditor: req.body.amount_creditor,
        receipt_payment: req.body.receipt_payment,
      });

      if (req.body.amount_creditor > clints.creditor) {
        req.flash("errors", " مبلغ وارد شده بیشتر از طلب است ");
        return this.back(req, res);
      }

      let s = clints.creditor - req.body.amount_creditor;
      clints.creditor = s;
      await clints.save();
      await newCreditor.save();
      return res.redirect(`/admin/creditorClint/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }

  async deleteClint(req, res, next) {
    this.isMongoId(req.params.id);
    const clint = await Clint.findById(req.params.id);

    const factors = await Factor.find({ clint: req.params.id });

    const debtors = await Debtor.find({ clint: req.params.id });

    factors.forEach(async (factor) => {
      const lines = await Line.find({ factor: factor.id });

      lines.forEach(async (line) => {
        await line.remove();
      });

      await factor.remove();
    });

    debtors.forEach(async (debtor) => {
      await debtor.remove();
    });

    await clint.remove();
    return res.redirect("/admin/clints");
  }

  async showEditeClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      const clints = await Clint.findById(req.params.id);

      res.render("admin/clint/editeClint", { clints });
    } catch (err) {
      next(err);
    }
  }

  async editeClint(req, res, next) {
    try {
      this.isMongoId(req.params.id);
      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      await Clint.findByIdAndUpdate(req.params.id, {
        $set: {
          ...req.body,
        },
      });

      return res.redirect("/admin/clints");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new clintController();
