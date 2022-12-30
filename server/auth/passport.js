const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "d997b86a580f1808d094e7e76baee30c48a87d256a06c169769d62033631ac812dfa8f2570e20588128f58357aaf77b936bf2e36832fe03f41ce50be79319082";

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