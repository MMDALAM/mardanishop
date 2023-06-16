const controller = require('app/http/controllers/controller');
const PurchaseInvoice = require('app/models/purchaseInvoice');
const fs = require('fs');

class purchaseInvoiceController extends controller {

    async index(req, res, next) {
        try {
            res.render('admin/purchaseInvoice/factorInv')
        } catch (err) {
            next(err)
        }
    }

    async showPurchaseInvoice(req, res, next) {
        try {
            const PI = await PurchaseInvoice.find();
        
            let p = [];
            PI.forEach(async (e) => {
                p.push(e.namePart);
            });
            let PInvos = [...new Set(p)];

            res.render('admin/purchaseInvoice/showPurchaseInvoice' , { PInvos })
        } catch (err) {
            next(err)
        }
    }

    async uploadFactorInv(req, res, next) {
        try {
            res.render('admin/purchaseInvoice/upload')
        } catch (err) {
            next(err)
        }
    }

    async proccessFactorInv(req, res, next) {
        try {
            let status = await this.validationData(req);
            if (!status) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                    return this.back(req, res);
                }
                return this.back(req, res);
            }
            
            let img = (req.file);
            let image = img.destination + img.filename   
            
            const newPurchaseInvoice = new PurchaseInvoice({
                nameFactor: req.body.nameFactor,
                namePart: req.body.namePart,
                nameVisitor: req.body.nameVisitor,
                images: image.substring(8),
            });

            try {
                await newPurchaseInvoice.save();
                req.flash('errors', 'فاکتور خرید ثبت شد');
                return this.back(req, res)
            } catch (err) {
                if (err.code == 11000) {
                    req.flash('errors', ' فاکتور خرید با این نام قبلا ثبت شده است ');
                    return this.back(req, res)
                }
            }
            

            
        } catch (err) {
            next(err)
        }
    }

    async purchaseInvoice(req, res, next) {
        this.isMongoId(req.params.id);
        const purchaseInvoice = await PurchaseInvoice.findById(req.params.id);

        if (purchaseInvoice === null) {
            return res.redirect('/admin/showPurchaseInvoice')
        }
        
        res.render('admin/purchaseInvoice/PurchaseInvoice' , {purchaseInvoice})
    }

    async deletePurchaseInv(req, res, next) {
        this.isMongoId(req.params.id);
        const purchaseInvoice = await PurchaseInvoice.findById(req.params.id);

            try {
                fs.unlinkSync(`./public${purchaseInvoice.images}`);
            } catch (err) {
                console.log(err);
            }

        await purchaseInvoice.remove();
        return res.redirect('/admin/showPurchaseInvoice');
    }

    async showPurchaseInvoicePart(req, res, next) {
        try {
            const purchaseInvoices = await PurchaseInvoice.find({ namePart: req.body.pIPart });

            if (purchaseInvoices == 0) {
                req.flash('errors', ' فاکتور مورد نظر شما پیدا نشد ');
                return this.back(req, res);
            }

            res.render('admin/purchaseInvoice/showPurchaseInvoicePart', { purchaseInvoices });
        } catch (err) {
            next(err)
        }
    }

}

module.exports = new purchaseInvoiceController()