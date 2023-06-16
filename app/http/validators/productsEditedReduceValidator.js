const validator = require('./validator');
const { body } = require('express-validator');

class productsEditedReduceValidator extends validator { 

    handle() {
        return [
            
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
 
module.exports = new productsEditedReduceValidator();