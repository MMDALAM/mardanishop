const validator = require('./validator');
const { body } = require('express-validator');

class factorValidator extends validator { 

    handle() {
        return [
            body('name_clint')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام خالی است'),
        ]
    }
}
 
module.exports = new factorValidator();