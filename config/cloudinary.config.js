const debug = require('debug')('cloudinary');

module.exports = cloudinary => {
    if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
      debug('!! cloudinary config is undefined !!');
      debug('export CLOUDINARY_URL or set dotenv file');
    }else{
      debug('CLOUDINARY CONFIG :');
      debug(cloudinary.config());
    }
}