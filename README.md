# SOURCES_SHARING
### Express_passport_mongodb_cloudinary

This project is the fundamental role_based authentication, upload and view pdf file.

# Table of contents
- [SOURCES_SHARING](#sourcessharing)
    - [Express_passport_mongodb_cloudinary](#expresspassportmongodbcloudinary)
- [Table of contents](#table-of-contents)
- [Preparation](#preparation)
- [The MVC Model](#the-mvc-model)
- [Salt Hash Password](#salt-hash-password)
- [Authentication with Passport](#authentication-with-passport)
- [Validation](#validation)
- [Role-Based Authentication](#role-based-authentication)
- [Upload File to Cloudinary](#upload-file-to-cloudinary)
- [Handle Request, Errors](#handle-request-errors)
- [Connecting to Mlab](#connecting-to-mlab)
- [Logging](#logging)
- [CSRF](#csrf)
- [API](#api)
- [Login with Facebook](#login-with-facebook)

#  Preparation
There are a lot of dependencies right here, I'll go though each of them:
* [`body-parser`][body-parser] Parse incoming request bodies in a middleware before your handlers
* [`cloudinary`][cloudinary] Delivering images and videos dynamically
* [`connect-flash`][connect-flash] Storing messages, passing messages though redirects
* [`debug`][debug] Logging imformations
* [`dotenv`][dot-env] Loading environment variables from `.env` file into `process.env`
* [`express`][express] A flexible Node.js web application framework
* [`express-session`][express-session] Storing session data on server-side, and sessionID on client-side as a cookie
* [`mongoose`][mongoose] MongoDB database
* [`passport`][passport] Authentication middleware
* [`passport-local`][passport-local] Passport Strategy for authenticating with username and password
* [`passport-facebook`][passport-facebook] Passport Strategy for login with Facebook using the OAuth 2.0 API
* [`pug`][pug] Template engine
* [`validator`][validator]	Validate user inputs
* [`csurf`][csurf] Cross-Side Request Forgery (CSRF)

# The MVC Model
![MVC Model][mvc-model]

**Router** : Routing is the process of taking a URI endpoint (that part of the URI which comes after the base URL ) and decomposing it into parameters to determine which module, controller, and action of that controller should receive the request.

**Controller** : Controllers are responsible for controlling the flow of the application execution. When you make a request (means request a page) to MVC application, a controller is responsible for returning the response to that request.

**Model** : Model represents domain specific data and business logic in MVC architecture. It maintains the data of the application. Model objects retrieve and store model state in the persistance store like a database.

**View** : It receives data from the Controller of the MVC and packages it and presents it to the browser for display.

# Salt Hash Password
After receiving a POST request to register, controller will create a `user`, before saving it, `user` will be set the `salt` and `hash` properties.
```js
user.setPassword(password);
```
In our `User` model :
```js
const { saltHashPassword, comparePassword } = require('../utils/salt.hash.password');

userSchema.methods.setPassword = function (pwd) {
    const pwdCrypto = saltHashPassword(pwd);
    this.salt = pwdCrypto.salt;
    this.hash = pwdCrypto.hashPassword;
    console.log(this);
};
```

In `utils/salt.hash.password.js`

```js
const crypto = require('crypto');

const getRandomString = length => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const sha512 = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const hashPassword = hash.digest('hex');

    return {
        salt, hashPassword
    };
};

const saltHashPassword = userpassword => {
    const salt = getRandomString(16);
    const passwordData = sha512(userpassword, salt);
    return passwordData;
};

const comparePassword = (password, salt, hash) => {
    const passwordData = sha512(password, salt);
    return hash === passwordData.hashPassword;
}
```
When a user login, we use the `comparePassword` to make sure the password is correct;

# Authentication with Passport
Config a Local Login Strategy (see `config/passport.config.js`) :
- Override the `usernameField` and `passwordField`, by default, local strategy uses username and password.
- Set the `passReqToCallback` will allow us to use the req as the first arguments of the callback function.


```js
const localOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};
```

- Using `LocalStrategy` for username/password authentication
	- Finding user in database and valid password.
	- The `done` callback will take 3 arguments `(error, user, message)`.
	- For `done(null, user)` there is not any errors, `user` will be passed to `serializeUser`.
	- The `message` in the bellow code is a object. And we will receive it in `customCallback` as `info` object.

```js
const localStrategyLogin = new LocalStrategy(localOptions, (req, username, password, done) => {
    User.findByUsername(username, (err, user) => {
        if (err) return done(err);
        if (!user)
            return done(null, false, { 'login-message': 'User not found' });
        if (!user.validPassword(password))
            return done(null, false, { 'login-message': 'Password incorrect' });

         done(null, user);
    });
});
```

- Naming the Local-Stategy `'local-login'`.
- Calling `passport.use()` will make use of the strategy you want.

```js
passport.use('local-login', localStrategyLogin);
```

- Configuration :
	- For persistent login sessions, passport needs ability to **serialize** and **deserialize** users out of session.
	- If you pass the `user.id` as the second argument to `done`, then you will receive the `id` in the callback of `deserializeUser` when received subsequent request. (For keeping the amount of data stored within the session small, only pass the `user.id`).
	- By `id` deserialize will find the `user` in database and pass it to `done`. Then `user` will be stored to `req.user`.
	- The following code will transform the `user` to `{ id, username, firstName, lastName }` after storing it by calling `done`.

```js
const configPassport = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

     passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (err) return done(err);

             const userAuth = {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            };

             done(null, userAuth);
        });
    });
    
    passport.use('local-login', localStrategyLogin);
};

module.exports = configPassport;
```

- In `index.js` at the root folder
	- If your application uses persistent login sessions, `passport.session()` middleware must also be used.
	- The `session()` must be use before `passport.session()`.

```js
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 120000
    }
}));

require('./config/passport.config')(passport);
app.use(passport.initialize());
app.use(passport.session());
```

- In `auth.route.js`

```js
router.get('/login', controller.indexLogin);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
```

- In `auth.controller.js`
    - Login with `passport.authenticate(strategyName, customCallback)(req, res, next);`
    - When using custom callback, we call `req.Login`, it becomes the application's responsibility to establish a session and send a response.
    - The `info` object represent the object we pass as the third argument to `done` in `local-login`.

```js
const login = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        // get the current-request-url from auth middleware
        // if non-exist, set default '/'
        const currentUrl = req.flash('current-request-url')[0] || '/';

        if (err) return next(err);
        if (!user) return res.render('auth/login', { error: { message: info['login-message'] }});

        req.logIn(user, err => {
            if (err) return next(err);
            // redirect user back to the url required
            res.redirect(currentUrl);
        });
    })(req, res, next);
};
```

- Require login `auth.middleware.js`

```js
const requireAuth = (req, res, next) => {
    const user = req.user;
    // set original url to specific what url user want to access
    req.flash('current-request-url', req.originalUrl);
    // redirect to /auth/login if non-authentication
    // original url will be used to redirect after login successfully
    if (!user) return res.redirect('/auth/login');

    next();
};
```

- In `source.route.js`
	- Require auth whenever take GET request `/sources/upSource`

```js
router.get(
    '/upSource',
    auth.requireAuth,
    controller.upSource
);
```

<img src="/images/passport_local_require_login.png">

- Logout : destroy the session and call `req.logout()`

```js
const logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        req.logout();
        res.redirect('/');
    });
};
```
# Validation
- In `user.validate.js`
	- Store the error in `errors` object
	- Using `req.flash` to store `errors` and user information pass it back to `/auth/register` if there is any fields invalid.

```js
const validator = require('validator');

module.exports.validate = (req, res, next) => {
    const user = req.body;
    const errors = {};

    if (validator.isEmpty(user.firstName))
        errors.firstName = 'Please enter First Name';

    . . .

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
        req.flash('errors-validate', errors);
        req.flash('user-inputs', user);
        res.redirect('/auth/register');
        return;
    }

    next();
}
```

- In `auth.controller.js`
	- Register will receive the errors and user information if some of the informations are invalid.

```js
const register = (req, res) => {
    const errors = req.flash('errors-validate')[0] || {}; // validate failed
    const user = req.flash('user-inputs')[0] || {};

    res.render('users/createAccount', {
        user,
        errors
    });
};
```

- In `views/user/createAccount.pug`
	- Any invalid field will render to notice user to replace it
	- Valid fields will also remain `value=user.firstName || ''`

```pug
.form-group
    if errors.firstName
        .alert.alert-danger.text-center #{errors.firstName}
    label(for='firstName') First Name
    input#firstName.form-control(type='text', name='firstName', placeholder='Enter First Name', value=user.firstName || '')
```

- In `auth.route.js`
	- Validate before saving docs

```js
router.get('/register', controller.register);
router.post('/register', validator.validate, controller.postRegister);
```
# Role-Based Authentication
- User can have many role **reader**, **admin**, **uploader**
	- By default, after successfully registering, user have role **reader**
- In `user.model.js`

```js
userSchema.pre('save', function(next) {
    if (!this.roles.includes('reader'))
        this.roles.push('reader');
    next();
});

userSchema.statics.getRolesByUserId = function (id, cb) {
    this.findById(id).select('roles').exec(cb);
};
```

- In `auth.middleware.js`
	- `requireRole` will take a list of **roles** and return a **middleware**
	- The request authorized only when user have one of the role which required by the route.

```js
const requireRole = roles => (req, res, next) => {
    // get all the roles of the current login user
    User.getRolesByUserId(req.user.id, (err, user) => {
        if (err) return next(err);

        // if they have one of the role required
        if (roles.some(role => user.roles.includes(role))) {
              // you are permited
            return next();
        }
        // forbidden
        res.render('errors/authorized');
    });
};
```

- Require role in `source.route.js`
	- Only **uploader** and **admin** can access `/sources/upSource`

```js
router.get(
    '/upSource',
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    controller.upSource
);
```

# Upload File to Cloudinary
- Cloudinay configuration

```js
cloudinary.config();
```

- Make sure you define env variable in `.env` file.
	- To have `CLOUDINARY_URL` see [cloudinary.com](https://cloudinary.com/users/register/free)

```js
# Cloudinary
CLOUDINARY_URL= . . .
```

- In `source.model.js`
	- Define `file_data` to store infomation about the pdf file.

```js
const sourceSchema = new Schema({
    file_name: {
        type: String,
        required: true
    },
    file_data: {
        type: Schema.Types.Mixed,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    // uploadAt, createAt
    timestamps: true
});
```

- Install package `cloudinary`, `cloudinary-jquery-file-upload`, `connect-multiparty`
	- `connect-multipart` middleware will create temp files on your server and never clean them up. Thus you should not add this middleware to all routes; only to the ones in which you want to accept uploads. And in these endpoints, be sure to delete all temp files, even the ones that you don't use.
- In `source.route.js`

```js
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

router.post(
    '/upSource',
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    multipartMiddleware,
    validator.validate,
    controller.postUpSource
);
```

- In `source.controller.js`
	- `file_data` will contains `{ public_id, format, bytes, url, ... }`
	- To render file to view, call `cloudinary.url(public_id)`

```js
const cloudinary = require('cloudinary').v2;

const postUpSource = (req, res, next) => {
    const source = new Source();
    source.author = req.user.id;
    source.file_name = req.files.file_upload.originalFilename;
    source.description = req.body.description;
    source.title = req.body.title;

    // Get temp file path
    var filePath = req.files.file_upload.path;
    // Upload file to Cloudinary
    cloudinary.uploader.upload(filePath, {tags: 'sources_sharing'})
        .then(function (file_data) {
            debug('** file_data uploaded to Cloudinary service');
            debug(file_data);
            source.file_data = file_data;
            // Save source with file_data metadata
            return source.save();
        })
        .then(function (photo) {
            debug('** source saved');
        })
        .catch(err => next(err))
        .finally(function () {
        	// remove all temp file
            delete req.files;
            res.redirect('/users/viewOwnSources');
        });
};
```

- In `request.middleware.js`
	- Reveal `cloudinary` to view file.

```js
const wirePreRequest = (req, res, next) => {
	res.locals.cloudinary = cloudinary;
};
```

- In `/views/sources/index.pug`
	- Calling `cloudinary.url(public_id)` to get file from cloudinary server.

```pug
each s in sources
	.col.col-lg-4.text-center.bg-light.m-2.p-4
        h1=s.title
        iframe(src=cloudinary.url(s.file_data.public_id), width='400', height='400')
```

# Handle Request, Errors
- Before going though any middleware, the request will approach the `wirePreRequest` middleware
	- The first middleware
	- Ensure the env variable CLOUDINARY_URL
	- Esposing `userLogin` and `cloudinary`, then it avaiable only to views rendered during that request/response cycle.

```js
const wirePreRequest = (req, res, next) => {
    debug(req.method + ' ' + req.url);
    if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
        throw new Error('Missing CLOUDINARY_URL environment variable')
    }else{
        // Expose cloudinary package to view
        res.locals.cloudinary = cloudinary;
        if (req.user){
            res.locals.userLogin = {
                firstName: req.user.firstName,
                lastName: req.user.lastName
            };
        }
        next();
    }
};
```

- In `views/layouts/navbar.pug`
- Got it
	- The View will render fullname and button Logout if user has login successfully.
	- Otherwise, Login and Signup will show up.

```pug
form.form-inline
    if userLogin
        .btn.btn-success=(userLogin.firstName || '') + ' ' + (userLogin.lastName || '')
        a.btn.btn-danger(href='/auth/logout') Logout
    else
        a.btn.btn-info(href='/auth/login') Login
        a.btn.btn-warning(href='/auth/register') Signup
```

- One of the last middleware
	- The middleware after the request passed though the controller that make a response
	- If there any error `wirePostRequest` will render `500` page with the error.

```js
const wirePostRequest = (err, req, res, next) => {
    if (!err) return next();

    if (err === 'Must supply api_key') {
        res.status(500).render('errors/dotenv');
    } else {
        debug('ERROR :{} 500 ' + err.message);
        debug(err.stack);
        res.status(500).render('errors/500', { error: err});
    }
}
```

- Try to access non-exist url, `404` will be rendered.

```js
const notFoundMiddleware = (req, res, next) => {
    debug('ERROR :{} 404');
    res.status(404).render('errors/404', {
        err: 'Not found',
        url: req.url
    });
}
```

# Connecting to Mlab
- In `.env`
	- Create a db in [Mlab][mlab], then create a user with password.

```js
# Mlab
MLAB_USER=dat
MLAB_PASSWORD=123456dat
MLAB_URL="mongodb://${MLAB_USER}:${MLAB_PASSWORD}@ds213665.mlab.com:13665/sources_sharing"
```

- [`dotenv-expand`][dotenv-expand] adds variable expansion on top of `dotenv`.

```js
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
// configure environment variables
const myEnv = dotenv.config();
// expand existing env variables
dotenvExpand(myEnv);
```

- In `mongoose.config.js`
- We have two choices, one to connect to local, the other to Mlab
- Connecting to MongoDB by calling `mongoose.connect(url, options, callback);`, callback will take the first argument as error. If you don't pass a callback, using promise. The `mongoose.connect()` promise resolves to undefined.

```js
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,	// Never stop trying to reconnect
    reconnectInterval: 500	// Reconnect every 500ms
};

const connect = (url) => {
    debug('Connecting to MongoDB');
    mongoose.connect(url, options)
        .then(() => {
            debug('Connected');
        })
        .catch(err => {
            debug(err);
        });
};

const connectToLocalhost = () => {
    // customize your MONGO_URL in .env file
    connect(process.env.MONGO_URL);
};

const connectToMlab = () => {
    // customize your MLAB_URL in .env file
    connect(process.env.MLAB_URL);
};
```

# Logging
- Logging with [`debug`][debug]
	- [`debug`][debug] exposes a function; simply pass this function the name of your module, and it will return a decorated version of console.error for you to pass debug statements to. This will allow you to toggle the debug output for different parts of your module as well as the module as a whole.
	- `const debug = require('debug')(debugName);`

```js
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
```

- Ouput :

<img src="/images/debug_cloudinary.png">

- In `.env`
	- List all the debugName you want to log.

```js
# For logging
DEBUG=SERVER, mongoose, cloudinary, request, passport, password-util
```

# CSRF
- Using package [`csurf`][csurf]
- Node.js CSRF protection middleware.
- Requires either a session middleware or cookie-parser to be initialized first.

<br>

- In `source.route.js`
	- `source` contain a file, and need to be parsed, thus `csrfProtection` middleware must come after `multipartMiddleware`

```js
const csurf = require('csurf');

const csrfProtection = csurf();

router.get(
    '/upSource',
    csrfProtection,	// csrf
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    controller.upSource
);

router.post(
    '/upSource',
    auth.requireAuth,
    auth.requireRole([ 'uploader', 'admin' ]),
    // Parse http requests with content-type multipart/form-data
    multipartMiddleware,
    // csrfProtection
    csrfProtection,
    validator.validate,
    controller.postUpSource
);
```

- In `source.controller.js`
	- Send the `csrfToken` to view.

```js
const upSource = (req, res, next) => {
  	. . .
    res.render('sources/upSource', {
        errors,
        source,
        csrfToken: req.csrfToken()
    });
};
```

- In `views/sources/upSource.pug`
	- Set the `csrfToken` value as the value of a hidden input field named `_csrf`

```pug
form(method='POST', enctype='multipart/form-data')
    input(type='hidden', value=csrfToken, name='_csrf')
	. . .
```


# API
- In `/public/js/sendRequest.js`
	- Use [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (XHR) objects to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing. XMLHttpRequest is used heavily in AJAX programming.
	-  Retrieve any type of data, not just XML, and it supports protocols other than HTTP (including file and ftp).
	-  Whenever `readyState` change we check if the request finished and response is ready.
	-  With `POST` method, send the proper header information along with the request :
		- `application/x-www-form-urlencoded` : the body of the HTTP message sent to the server is essentially one giant query string -- name/value pairs are separated by the ampersand (&), and names are separated from values by the equals symbol (=).
		- `multipart/form-data` :  the boundary separator must not be present in the file data.
	- `POST` method, The `encodeURIComponent()` function encodes a URI component. The `xhttp.send()` in the below code will send with a query string. For example, data : `{foo: {bar: 'bar'}}` --> `encodedObj=%5Bobject%20Object%5D`
	- [`axios`](https://www.npmjs.com/package/axios) or [`jquery`](http://api.jquery.com/jquery.ajax/) may be more convenient
```js
function sendRequest(url, data, method, callback) {
    const xhttp  = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.response);
        }
    });

    // 3rd argument (true) use async
    xhttp.open(method, url, true);

    if (method === 'POST') {
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // send data with POST method
        let encodedObj = encodeURIComponent(JSON.stringify(data));
        xhttp.send(`encodedObj=${encodedObj}`);
    } else {
        xhttp.send();
    }
}
```

- `sendGerRequest` will make a GET request, `sendPostRequest` will make POST request with the 2nd argument is data.


```js
function sendGetRequest(url, callback) {
    sendRequest(url, null, 'GET', callback);
}

function sendPostRequest(url, data, callback) {
    sendRequest(url, data, 'POST', callback);
}

function sendPutRequest(url, data, callback) {
    sendRequest(url, data, 'PUT', callback);
}

function sendDeleteRequest(url, callback) {
    sendRequest(url, null, 'DELETE', callback);
}
```

- In `user.route.js`
- This route will render `views/sources/index` without `sources`

```js
router.get('/viewOwnSources', controller.viewOwnSources);
```

**GET Request**
- In `/publi/js/source.js`
	- The response must be a JSON object
	- Parse it to literal object and populate in the dom.

```js
const url = '/api/sources/myOwnSources';
const displaySources = document.querySelector('.display-sources');

sendGetRequest(url, function (response) {
    const sources = JSON.parse(response);

    displaySources.innerHTML = sources.map(s => `
        <div class="col col-lg-4 text-center bg-light m-2 p-4">
            <h1>${s.title}</h1>
            <iframe src=${s.url} width="400" height="400"></iframe>
            <a href="/sources/view/${s.id}" class="btn btn-info">View</a>
            <a href="/sources/delete/${s.id}" class="btn btn-danger">Delete</a>
        </div>
    `).join('');
});
```

- `api/controller/source.controller.js` will take GET request from url `/api/sources/myOwnSources` and also send a response which is a list of `source`.
	- `res.send()` will take everything and send it back to client.

```js
const findMyOwnSource = (req, res, next) => {
    Source.findSourcesByUserId(req.user.id, (err, sources) => {
        if (err) return next(err);
        const results = [];
        for (let i = 0; i < sources.length; i++) {
            results.push({
                id: sources[i].id,
                title: sources[i].title,
                description: sources[i].description,
                url: sources[i].file_data.secure_url,
                file_name: sources[i].file_name
            });
        }

        res.send(JSON.stringify(results));
    });
};
```

**POST Request**
- In `user.route.js`
	- Render `views/users/profile` with `userProfile` object

```js
router.get('/viewProfile', controller.viewProfile);
```

- Update `userProfile` with ajax
- In `public/js/profile.js`
	- Function `saveChanges` will call `sendPostRequest` with `profile` object

```js
document.form_profile.addEventListener('submit', function (e) {
    e.preventDefault();

     saveChanges(this, res => {
		// render response message
	});
});

function saveChanges(form, callback) {
    const url = '/api/users/saveProfile';
    const profile = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    };

    sendPostRequest(url, profile, callback);
}
```

- In `api/route/user.route.js`
	- Before saving into database, `profile` will be transform and validate.

```js
router.post(
    '/saveProfile',
    profileMiddleware.transformReqBody,
    controller.saveProfile
);
```

- In `api/middlewares/profile.middleware.js`
	- Firstly, `transformReqBody` parse the `req.body.encodedObj` to literal object
	- If any fields empty `res.send()` will be executed and send a message 'Please fullfill the form'
	- Then, req.body will also contain `password` to ensure that this changes, if password invalid return message 'Password incorrect'
	- In case, user choose login with facebook and the `salt` and `hash` field will be empty. We don't compare password in this case.

```js
const transformReqBody = (req, res, next) => {
    const user = JSON.parse(req.body.encodedObj);

     if (
        ! (user.firstName &&
        user.lastName &&
        user.username &&
        user.email)
    ) {
        return res.send({
            message: 'Please fullfill the form',
            error: []
        });
    }

     User.findById(req.user.id, (err, foundUser) => {
        if (err) return next(err);

         if (foundUser.salt && foundUser.hash && !foundUser.validPassword(user.password)) {
            return res.send({
                message: 'Password incorrect',
                error: []
            });
        }

        req.body = user;
        next();
    });
}
```

- In `api/controllers/user.controller.js` userProfile will be updated and saved into db.

```js
const saveProfile = (req, res, next) => {
    const { firstName, lastName, email, username } = req.body;

     User.findById(req.user.id, (err, user) => {
        if (err) return next(err);
         // updating user's profile
			. . .

         // saving profile
        user.save((err, savedUser) => {
        	// response
        });
    });
}
```


# Login with Facebook
- The Facebook strategy allows users to log in to a web application using their Facebook account. Internally, Facebook authentication works using OAuth 2.0.
- Support for Facebook is implemented by the [passport-facebook][passport-facebook] module.

<br>

- Configuration :
- In `config/auth.js`
	- Create a new App in [Developer Facebook](https://developers.facebook.com/)
	- Store the `app_id`, `app_secret`, `callback` in here.

```js
module.exports = {
    "facebook": {
        "app_id": "2050995164968108",
        "app_secret": "c817b1c6b28791cb55332393b9b77213",
        "callback": "http://localhost:9000/auth/facebook/callback"
    }
}
```

- In `passport.config.js`
	- `FacebookStrategy` take a callback will arguments `(req, accessToken, refreshToken, profile, done)`
	- `socialService.registerSocial(data, profile.provider, accessToken, done);` will find the user by email if exist `done` will be invoked with `existing_user`. If not, create a new user.
	- `callbackURL` : Facebook will redirect users after they have approved access for your application.

```js
const { Strategy: FacebookStrategy } = require('passport-facebook');

const facebookOptions = {
    clientID: auth.facebook.app_id,
    clientSecret: auth.facebook.app_secret,
    callbackURL: auth.facebook.callback,
    profileFields: [ 'id', 'displayName', 'photos', 'email', 'name' ],
    passReqToCallback: true
};

const facebookStrategy = new FacebookStrategy(
    facebookOptions,
    function (req, accessToken, refreshToken, profile, done) {
        let data = profile._json;
        socialService.registerSocial(data, profile.provider, accessToken, done);
        debug('Facebook data :', data);
    });
```

- In `services/social.service.js`
	- Using login with facebook at the first time, `registerSocial` will create a new account without password and save it. Otherwise it call `callback(null, existing_user)`

```js
const registerSocial = (data, provider, accessToken, callback) => {
    User.findOne({ 'email': data.email }, (err, existing_user) => {
        if (err) return callback(err);

        if (existing_user)
           return callback(null, existing_user);

        const lastName = data.last_name || '';
        const firstName = [data.middle_name, data.first_name].filter(Boolean).join(' ');

        let newUser = new User({
           firstName: firstName,
           lastName: lastName,
           email: data.email,
           profile_picture: data.profile_picture,
           social: {
               [provider]: {
                   id: data.id,
                   accessToken: accessToken
               }
           }
        });

        ewUser.save((err, user) => {
           if (err) return callback(err);
           callback(null, user);
       });
    });
};
```

- In `auth.route.js`
	- Two routes are required for Facebook authentication. The first route redirects the user to Facebook. The second route is the URL to which Facebook will redirect the user after they have logged in.

```js
router.get('/facebook', controller.loginFacebook);

router.get('/facebook/callback', controller.callbackFacebook);
```

- In `auth.controller.js`

```js
const loginFacebook = (req, res, next) => {
    passport.authenticate(
        'facebook-login',
        { scope: [ 'email', 'public_profile', 'user_location' ] }
    )(req, res, next);
}

const callbackFacebook = (req, res, next) => {
    passport.authenticate('facebook-login', {
        failureRedirect: '/auth/login',
        successRedirect: '/'
    })(req, res, next);
}
```

[debug]: https://www.npmjs.com/package/debug
[dotenv-expand]: https://github.com/motdotla/dotenv-expand/blob/master/test/.env
[mlab]: https://mlab.com/
[body-parser]: https://www.npmjs.com/package/body-parser
[cloudinary]: https://cloudinary.com/
[connect-flash]: https://www.npmjs.com/package/connect-flash
[dot-env]: https://www.npmjs.com/package/dotenv
[express]: http://expressjs.com/
[express-session]: https://www.npmjs.com/package/express-session
[mongoose]: https://mongoosejs.com/
[passport]: http://www.passportjs.org/
[passport-local]: https://www.npmjs.com/package/passport-local
[passport-facebook]: https://www.npmjs.com/package/passport-facebook
[pug]: https://pugjs.org/api/getting-started.html
[validator]: https://www.npmjs.com/package/validator
[csurf]: https://www.npmjs.com/package/csurf
[mvc-model]: /images/mvc_model.jpg