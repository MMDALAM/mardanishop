const validator = require('./validator');
const { body } = require('express-validator');

class productValidator extends validator { 

    handle() {
        return [
            body('name')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام محصول خالی است'),
        ]
    }
}
 
module.exports = new productValidator();