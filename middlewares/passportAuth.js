const passport = require('passport');
const { JWT_SECRET, REFRESH_SECRET } = require('../config');
const { User } = require('../models');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

exports.auth = () => {
  // Access token strategy
  const accessOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    'jwt',
    new JwtStrategy(accessOpts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload._id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // Refresh token strategy
  // const refreshOpts = {
  //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: REFRESH_SECRET,
  // };

  // passport.use(
  //   'jwt-refresh',
  //   new JwtStrategy(refreshOpts, async (jwt_payload, done) => {
  //     try {
  //       const user = await User.findById(jwt_payload._id);
  //       if (user) {
  //         return done(null, user);
  //       } else {
  //         return done(null, false);
  //       }
  //     } catch (err) {
  //       return done(err, false);
  //     }
  //   })
  // );
};
