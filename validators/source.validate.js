module.exports.validate = (req, res, next) => {
    const errors = {};
    // file was not uploaded 
    if (req.files.file_upload.size == 0)
        errors.file_upload = 'Please upload file';
    else if (req.files.file_upload.type.indexOf('application/pdf') < 0)
        errors.file_upload = 'Invalid file, please upload pdf';

    if (!req.body.description)
        errors.description = 'Please enter description';
    
    if (!req.body.title)
        errors.title = 'Please enter title';

    // any errors will be redirect back to form upload
    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
        req.flash('errors-validate', errors);
        req.flash('source-inputs', req.body);
        res.redirect('/sources/upSource');
        return;
    }

    next();
}