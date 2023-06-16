const controller = require('app/http/controllers/controller');
const Product = require('app/models/product');

class productController extends controller {
    async products(req, res, next) {
        try {
            res.render('admin/products/products')
        } catch (err) {
            next(err)
        }
    }

    async allProducts(req, res, next) {
        try {
            const products = await Product.find();
            res.render('admin/products/allProducts' ,{ products })
        } catch (err) {
            next(err)
        }
    }

    async singelProducts(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) return this.back(req, res);
            
            const products = await Product.findOne({ name: req.body.name });
            
            if (products == null) {
                req.flash('errors', 'محصول مورد نظر پیدا نشد');
                return this.back(req, res);
            }

            res.render('admin/products/singelProducts' ,{products})
        } catch (err) {
            next(err);
        }
    }

    async creatProducts(req, res, next) {
        try {
            res.render('admin/products/creatProducts')
        } catch (err) {
            next(err)
        }
    }

    async productsProccess(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) return this.back(req, res);

            let amounts = req.body.amountOfPackages * req.body.numberPerPackage
            + parseInt(req.body.amount);
            

            const newProduct = new Product({
                name: req.body.name,
                type: req.body.type,
                price_retail: req.body.price_retail,
                price_total: req.body.price_total,
                amountOfPackages: req.body.amountOfPackages,
                numberPerPackage: req.body.numberPerPackage,
                amount: amounts
            });

            const products = await Product.find();
            let unique = false;
            products.forEach(async(el) => {
                if (el.name === req.body.name)
                    return unique = true;
            });

            if (unique == true) {
                req.flash('errors', '!!!محصولی با این نام قبلا ثبت شده');
                return this.back(req, res);
            };

            await newProduct.save();
            req.flash('errors', 'محصول مورد نظر شما ذخیره شد');
            return this.back(req, res);
            
        } catch (err) {
            next(err);
        }
    }

    async showEditeProducts(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            const products = await Product.findById(req.params.id);
            
            res.render('admin/products/editeProducts' , {products})
        } catch (err) {
            next(err);
        }
    }

    async editeProducts(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            let status = await this.validationData(req);
            if (!status) return this.back(req, res);

            const products = await Product.findById(req.params.id);

            let Packages = parseInt(req.body.amountOfPackages) * req.body.numberPerPackage;


            let amount = (Packages + parseInt(req.body.amount)) + products.amount;

            let amountOfPackages = (products.amountOfPackages + parseInt(req.body.amountOfPackages));

            
            await Product.findByIdAndUpdate(req.params.id, {
                $set: {
                    ...req.body,amount
                }
            });
            
            return res.redirect('/admin/allProducts/');
        } catch (err) {
            next(err);
        }
    }

    async editedReduce(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            let status = await this.validationData(req);
            if (!status) return this.back(req, res);

            const products = await Product.findById(req.params.id);

            let Packages = parseInt(req.body.amountOfPackages) * req.body.numberPerPackage;


            let amount = products.amount - (Packages + parseInt(req.body.amount))  ;

            
            await Product.findByIdAndUpdate(req.params.id, {
                $set: {
                    ...req.body ,amount
                }
            });
            
            return res.redirect('/admin/allProducts/');
        } catch (err) {
            next(err);
        }
    }

    async deleteProducts(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            await Product.findByIdAndDelete(req.params.id);

            return res.redirect('/admin/allProducts');
        } catch (err) {
            next(err);
        }
    }
    
}

module.exports = new productController();