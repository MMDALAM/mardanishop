const autoBind = require('auto-bind-inheritance');
const { validationResult } = require('express-validator');
const isMongoId = require('validator/lib/isMongoId');

module.exports = class controller{
    constructor() {
        autoBind(this);
    }

    validationData(req) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            const messages = [];
            
            errors.forEach(err => messages.push(err.msg));

            req.flash('errors', messages);

            return false;
        }
        return true;
    }

    isMongoId(paramId){
        if(! isMongoId(paramId)){
            throw new Error('ای دی وارد شده صحیح نیست')
        }
    }

    error(message , status = 500){
        let err = new Error(message);
        err.status = status;
        throw err;
    }


    back(req, res) {
        req.flash('formData', req.body);
        return res.redirect(req.header('Referer') || '/');
    }

    async alert(req, data) {
        let title = data.title || '',
            message = data.message || '',
            icon = data.icon || 'info',
            button = data.button || null,
            timer = data.timer || 2000;
        
            await req.flash('sweetalert', { title, message, icon, button, timer });
    }

}
