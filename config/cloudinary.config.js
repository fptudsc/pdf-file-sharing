module.exports = cloudinary => {
    if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
      console.warn('!! cloudinary config is undefined !!');
      console.warn('export CLOUDINARY_URL or set dotenv file')
    }else{
      console.log('CLOUDINARY CONFIG :');
      console.log(cloudinary.config())
    }
}