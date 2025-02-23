// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// require('dotenv').config()

// passport.serializeUser((user, done) => {
// 	done(null, user);
// })
// passport.deserializeUser(function (user, done) {
// 	done(null, user);
// });

// passport.use(new GoogleStrategy(
//     {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "https://zstyleinat.xyz/auth/google/callback",
//         scope: ["profile", "email"],
//       },
// 	function (request, accessToken, refreshToken, profile, done) {
// 		return done(null, profile);
// 	}
// ));


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://zstyleinat.xyz/auth/google/callback",
        scope: ["profile", "email"],
    },
    (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
));
