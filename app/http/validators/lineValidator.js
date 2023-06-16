const validator = require('./validator');
const { body } = require('express-validator');

class lineValidator extends validator { 

    handle() {
        return [
            body('name_product')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام محصول خالی است'),
            
            body('number_retail')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید تعداد جز خالی است'),
            
            body('number_total')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید تعداد بسته ای خالی است'),

        ]
    }
}
 
module.exports = new lineValidator();