// const express = require('express');
// const passport = require('passport');
// const router = express.Router();
// const {generateToken} =require("../utils/jwtUtils")
// const User =require("../models/user")
// const clintUrl="https://master.d298fqlts9wdsx.amplifyapp.com"
// // Google callback route
// router.get('/google-auth', passport.authenticate('google', {
//     scope:
//         ['email', 'profile']
// }))


// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: "https://master.d298fqlts9wdsx.amplifyapp.com/login" }),
//     async (req, res) => {    

//         const user = req.user;
//         const currentDate = new Date();
//         console.log(user)

//         try {
//             const userExists = await User.findOneAndUpdate(
//                 { email: user.emails[0].value },
//                 {
//                     $set: {
//                         name: user.displayName,
//                         role: user.role, // Default to 'learner' if role is missing
//                         userId: user.id,
//                         updatedAt: currentDate,
//                     },
//                     $setOnInsert: {
//                         createdAt: currentDate,
//                     },
//                 },
//                 { upsert: true, new: true }
//             );
//             console.log(userExists)
//             console.log("disply name",userExists.id)

//             const jwt = generateToken(userExists);
//             res.redirect(`${clintUrl}learners?token=${jwt}&username=${user.displayName}&userRole=${userExists.role}&userid=${userExists.id}`);

 
//         } catch (error) {
//             console.error('Error during Google login:', error);
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }
// );

// module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require("../utils/jwtUtils");
const User = require("../models/user");

const clientUrl = "https://master.d298fqlts9wdsx.amplifyapp.com/";

// Google Authentication Route
router.get('/google-auth', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// Google Callback Route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${clientUrl}login` }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect(`${clientUrl}login?error=NoUserData`);
            }

            const user = req.user;
            const currentDate = new Date();

            // Check if email is available
            const email = user.emails?.[0]?.value;
            if (!email) {
                return res.redirect(`${clientUrl}login?error=EmailNotFound`);
            }

            const userExists = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        name: user.displayName,
                        userId: user.id,
                        updatedAt: currentDate,
                        role: user.role
                    },
                    $setOnInsert: {
                        createdAt: currentDate,
                        // role: 'learner' // Default role
                    },
                },
                { upsert: true, new: true }
            );

            console.log("User:", userExists);

            // Generate JWT token
            const jwt = generateToken(userExists);
            res.redirect(`${clientUrl}learners?token=${jwt}&username=${encodeURIComponent(user.displayName)}&userRole=${userExists.role}&userid=${userExists.id}`);
        } catch (error) {
            console.error('Error during Google login:', error);
            res.redirect(`${clientUrl}login?error=ServerError`);
        }
    }
);

module.exports = router;