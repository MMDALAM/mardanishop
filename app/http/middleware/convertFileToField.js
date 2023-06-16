const middleware = require('./middleware');

class convertFileToField extends middleware{

    handle(req, res, next) {
        if(! req.files)
            req.body.images =  undefined;
        else
            req.body.images = req.files.filename;
            
        next();
    }

    handles(req , res , next){
        if(! req.files)
            req.body.files =  undefined;
        else
            req.body.files = req.files.filename;

        next();
    }

}

module.exports = new convertFileToField();