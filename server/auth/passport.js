const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
    "admin",
    new JwtStrategy(opts, function (jwt_payload, done) {
        return done(null, authorized(jwt_payload, "admin"));
    })
);

passport.use(
    "user",
    new JwtStrategy(opts, function (jwt_payload, done) {
        return done(null, authorized(jwt_payload, "user"));
    })
);

function authorized(user, role) {
    return user.role === role;
};

module.exports = passport;