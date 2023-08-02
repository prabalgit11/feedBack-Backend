const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDetail = require('./../models/userModel');


const validateUser = async (userObj) => {
    try {
        const { name, email, mobile, password } = userObj;
        if (!name || !email || !mobile || !password) {
            return ({
                success: 'fail',
                message: 'Could you please provide your inputs!'
            });
        }

        const isEmailExist = await userDetail.findOne({ email });
        const isMobileExist = await userDetail.findOne({ mobile });


        if (isEmailExist || isMobileExist) {
            return ({
                success: 'fail',
                message: ' This mobile or email already exists!!'
            });
        }
        else {
            return ({
                success: 'pass',
                message: 'User details are valid'
            });
        }
    }
    catch (err) {
        return ({
            success: 'fail',
            message: 'Validation Error'
        })
    }
}

const registerUser = async (userObj) => {
    try {
        const { name, email, mobile, password } = userObj;
        const result = await validateUser(userObj);
        if (result.success) {
            let encryptedPassword = await bcrypt.hash(password, 10);
            const newUser = new userDetail({
                name: name,
                email: email,
                mobile: mobile,
                password: encryptedPassword
            })
            const userRegistered = newUser.save();
            return ({
                success: 'pass',
                message: 'user registered successfully'
            })
        }
        else {
            return ({
                success: 'fail',
                message: result.message
            })
        }
    }
    catch (err) {
        return ({
            success: 'fail',
            message: 'user not created ,please try again'
        })
    }
}

const loginUser = async (userObj) => {
    const { email, password } = userObj;
    if (!email, !password) {
        return ({
            success: 'fail',
            message: 'Could you please provide your inputs'
        })
    }
    else {
        const isEmailExist = await userDetail.findOne({ email });
        if (isEmailExist) {
            if (await (bcrypt.compare(password, isEmailExist.password))) {
                const token = jwt.sign(
                    { user_id: isEmailExist._id, email },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                return ({
                    success: 'pass',
                    message: ' JWT Token successfully generated',
                    token: token
                })
            }
            else {
                return ({
                    success: 'fail',
                    message: 'Invalid Credentials'
                })
            }
        }
        else {
            return ({
                success: 'fail',
                message: 'User not registered'
            })
        }
    }
}

module.exports = {
    registerUser,
    loginUser
}
