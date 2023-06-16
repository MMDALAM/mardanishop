const validator = require('./validator');
const { body } = require('express-validator');

class clintsValidator extends validator { 

    handle() {
        return [
            body('clints')
                .not().isEmpty()
                .withMessage('لطفا دقت کنید نام مشتری خالی است'),
        ]
    }
}
 
module.exports = new clintsValidator();