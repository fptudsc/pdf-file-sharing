const User = require('mongoose').model('User');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const auth = require('./auth');

const debug = require('debug')('passport');

const socialService = require('../services/social.service');

const localOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

const facebookOptions = {
    clientID: auth.facebook.app_id,
    clientSecret: auth.facebook.app_secret,
    callbackURL: auth.facebook.callback,
    profileFields: [ 'id', 'displayName', 'photos', 'email', 'name' ],
    passReqToCallback: true
};

const localStrategyLogin = new LocalStrategy(localOptions, (req, username, password, done) => {
        debug('User logining');
        User.findByUsername(username, (err, user) => {
            if (err) return done(err);
            if (!user)
                return done(null, false, { 'login-message': 'User not found' });
            if (!user.validPassword(password))
                return done(null, false, { 'login-message': 'Password incorrect' });

            done(null, user);
        });
});

const facebookStrategy = new FacebookStrategy(facebookOptions, (req, accessToken, refreshToken, profile, done) => {
    let data = profile._json;
    socialService.registerSocial(data, profile.provider, accessToken, done);
    debug('Facebook data :', data);
});

const configPassport = passport => {
    passport.serializeUser((user, done) => {
        debug(`Serialize user : { user.id: ${user.id}}`);
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
            
            debug('Deserialize user :', userAuth);
            done(null, userAuth);
        });
    });

    passport.use('local-login', localStrategyLogin);
    passport.use('facebook-login', facebookStrategy);
};

module.exports = configPassport;