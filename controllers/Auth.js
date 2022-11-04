const User = require('../models/UserModel')
var nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'serap.baysal@hotmail.com',
        pass: 's11101999'
    }
});


exports.signup = async (req, res) => {
    const { Firstname, Lastname, Email, Password } = req.body;
    try {
        const userExists = await User.exists({ Email });
        if (userExists) {
            return res.status(401).json({
                success: false,
                message: "This email is using!"
            })
        } else {
            const user = await User.create({
                Firstname,
                Lastname,
                Email,
                Password
            })
            const id = user._id;

            var mailOptions = {
                from: 'serap.baysal@hotmail.com',
                to: Email,
                subject: 'Sending Email using Node.js',
                text: `http://localhost:5000/auth/isActiveUser/${id}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent');
                }
            });


            return res.json({
                success: true,
                user
            })
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error
        })

    }
}

exports.isActiveUser = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);

    user.Isactive = true;

    return res.json({
        user
    })

}
exports.loginWithPassword = async (req, res, next) => {
    const { Email, Password } = req.body;


    if (!Email || !Password) {
        return res.json({
            success: false,
            message: "Email or Password not found!"
        })
    }

    // Check for user
    const user = await User.findOne({ Email }).select('+Password');

    if (!user) {
        return res.json({
            success: false,
            message: "User not exists!"
        })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(Password);

    if (!isMatch) {

        user.login = false;
        user.save();
        return res.json({
            success: false,
            message: "Password not match"
        })

    } else {
        user.Isactive = true;
        let token = user.getLoginJwtToken();
        user.save()

        const options = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 1 * 1 * 1 * 1

            ),
            httpOnly: true,
        };
        res.status(200).json({
            token,
            user

        });

    }
}

exports.loginWithoutPassword = async (req, res) => {
    const { Email } = req.body;

    const user = await User.findOne({ Email: Email });

    const id = user._id; 

    const emailLoginToken = user.getLoginJwtToken();
   

    user.emailLoginToken = emailLoginToken;
    user.save();

    var mailOptions = {
        from: 'serap.baysal@hotmail.com',
        to: Email,
        subject: 'Login',
        text: `http://localhost:5000/auth/${id}/login?code=${emailLoginToken}`
    };
    

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
        }
    });


    return res.json({
        user
    })
}


exports.IsLoggedIn = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);

    const emailLoginToken = user.emailLoginToken;
    

    user.Isactive = true;
    user.IsLogin = true;

    user.save();

    return res.json({
        emailLoginToken,
        user
    })

}