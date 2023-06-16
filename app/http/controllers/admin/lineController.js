const controller = require("app/http/controllers/controller");
const Factor = require("app/models/factor");
const Product = require("app/models/product");
const Line = require("app/models/line");

class lineController extends controller {
  async lineProccess(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      let status = await this.validationData(req);
      if (!status) return this.back(req, res);

      const factor = await Factor.findById(req.params.id);

      if (!factor) {
        req.flash("errors", " فاکتور مورد نظر شما پیدا نشد ");
        return this.back(req, res);
      }

      const products = await Product.findOne({ name: req.body.name_product });

      if (!products) {
        req.flash("errors", " محصول مورد نظر شما پیدا نشد ");
        return this.back(req, res);
      }

      if (isNaN(parseInt(req.body.number_retail))) {
        req.flash("errors", "مقدار باید (0.5) نوشته شود");
        return this.back(req, res);
      }

      let Retail = parseInt(req.body.number_retail * products.price_retail);
      let total = parseInt(req.body.number_total * products.price_total);

      let priceTotal = Retail + total;

      let some = parseFloat(req.body.number_total * products.numberPerPackage);
      let somes = some + parseFloat(req.body.number_retail);

      if (somes > products.amount) {
        req.flash("errors", " مقداری انتخابی ناموجود است ");
        return this.back(req, res);
      }

      const newLine = new Line({
        factor: factor._id,
        product: products._id,
        name_product: products.name,
        type: products.type,
        number_retail: req.body.number_retail,
        price_retail: products.price_retail,
        number_total: req.body.number_total,
        price_total: products.price_total,
        cut: somes,
        priceTotal: priceTotal,
      });

      await newLine.save();
      req.flash("errors", " محصول مورد نظر شما ذخیره شد ");
      return this.back(req, res);
    } catch (err) {
      next(err);
    }
  }

  async lineDelete(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const line = await Line.findById(req.params.id);

      await line.remove();
      return this.back(req, res);
    } catch (err) {
      next(err);
    }
  }

  async lineChange(req, res, next) {
    this.isMongoId(req.params.id);

    if (!req.body.price_retail && !req.body.price_total) {
      req.flash(
        "errors",
        "برای تغییر قیمت لطفا قیمت جز یا قیمت کل مدنظر را وارد کنید "
      );
      return this.back(req, res);
    }

    const lines = await Line.findById(req.params.id);
    const products = await Product.findOne({ name: lines.name_product });

    let price_retail = 0;
    if (isNaN(parseInt(req.body.price_retail))) {
      price_retail = Math.floor(
        parseInt(req.body.price_total) / products.numberPerPackage
      );
    } else {
      price_retail = parseInt(req.body.price_retail);
    }

    let price_total = 0;
    if (isNaN(parseInt(req.body.price_total))) {
      price_total = Math.floor(
        parseInt(req.body.price_retail) * products.numberPerPackage
      );
    } else {
      price_total = parseInt(req.body.price_total);
    }

    let priceTotal = 0;
    priceTotal =
      price_retail * lines.number_retail + price_total * lines.number_total;

    await Line.findByIdAndUpdate(req.params.id, {
      $set: {
        price_retail: price_retail,
        price_total: price_total,
        priceTotal: priceTotal,
      },
    });

    return this.back(req, res);
  }
}

module.exports = new lineController();
