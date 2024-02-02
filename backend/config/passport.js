const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel.js");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists in the database
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If the user exists, update their information (if needed)
            // For example, you might want to update their profile picture or email
            // based on the latest information from Google
            // user.email = profile.emails[0].value;
            // user.avatar = profile.photos[0].value;

            // Save the updated user
            user = await user.save();
          } else {
            // If the user doesn't exist, create a new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              // Add other relevant fields
            });
          }

          // Pass the user object to the next middleware
          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error, null);
        }
      }
    )
  );
};
