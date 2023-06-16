const validator = require('./validator');
const { body } = require('express-validator');

class purchaseInvoiceValidator extends validator { 

    handle() {
        return [
            body('nameFactor')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام فاکتور خالی است'),
            
            body('namePart')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام بخش خالی است'),
            
            body('nameVisitor')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام ویزیتور خالی است'),
            
            body('images')
                .custom(async (value, { req }) => {
                    if (req.file === undefined) {
                        throw new Error('وارد کردن تصویر الزامی است');
                    } else {
                        if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
                        } else { throw new Error(` png یا jpg فایل باید عکس باشد فرمت`) }
                    }
                })
        ]
    }
}
 
module.exports = new purchaseInvoiceValidator();