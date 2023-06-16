const validator = require('./validator');
const { body } = require('express-validator');

class createFactorValidator extends validator { 

    handle() {
        return [
            body('name_clint')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام مشتری خالی است'),
            
            body('phone')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید شماره خالی است'),
        ]
    }
}
 
module.exports = new createFactorValidator();