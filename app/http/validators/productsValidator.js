const validator = require('./validator');
const { body } = require('express-validator');

class productsValidator extends validator { 

    handle() {
        return [
            body('name')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام محصول خالی است'),
            
            body('type')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نوع محصول خالی است'),
            
            body('price_retail')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید قیمت جز خالی است'),
            
            body('price_total')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید قیمت بسته ای خالی است'),
            
            body('amountOfPackages')
                .not().isEmpty()
                .withMessage('تعداد بسته های موجود را وارد کنید'),

            body('numberPerPackage')
                .not().isEmpty()
                .withMessage('تعداد موجود در هر بسته را وارد کنید'),
            
            body('amount')
                .not().isEmpty()
                .withMessage('تعداد جز موجود را وارد کنید'),

        ]
    }
}
 
module.exports = new productsValidator();