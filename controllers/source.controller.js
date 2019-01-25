const index = (req, res, next) => {
    res.render('sources/index');
};

const upSource = (req, res, next) => {
    //  get errors and source-inputs from "post" /upSource (validate middleware) using flash
    // if non-exist assign with empty-obj
    const errors = req.flash('errors-validate')[0] || {};
    const source = req.flash('source-inputs')[0] || {};

    // if exist
    // push errors and source-input back to user
    res.render('sources/upSource', {
        errors,
        source
    });
};

const postUpSource = (req, res, next) => {

    res.redirect('/sources');
};

module.exports = {
    index,
    upSource,
    postUpSource
}