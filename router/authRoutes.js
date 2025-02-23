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
    passport.authenticate('google', { failureRedirect: "https://master.d298fqlts9wdsx.amplifyapp.com/login" }),
    async (req, res) => {
        if (!req.user) {
            console.error("❌ Google Authentication Failed: No user found in req.user");
            return res.redirect("https://master.d298fqlts9wdsx.amplifyapp.com/login");
        }

        console.log("✅ Google Authentication Success:", req.user);

        try {
            const userExists = await User.findOneAndUpdate(
                { email: req.user.emails[0].value },
                {
                    $set: {
                        name: req.user.displayName,
                        role: req.user.role || "learner", // Default to 'learner'
                        userId: req.user.id,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                },
                { upsert: true, new: true }
            );

            console.log("✅ User saved/updated:", userExists);

            const jwt = generateToken(userExists);
            console.log("✅ Generated JWT:", jwt);

            res.redirect(`https://master.d298fqlts9wdsx.amplifyapp.com/learners?token=${jwt}&username=${req.user.displayName}&userRole=${userExists.role}&userid=${userExists.id}`);
        } catch (error) {
            console.error("❌ Error saving user:", error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);


module.exports = router;