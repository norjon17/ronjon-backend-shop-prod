"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customValidation = void 0;
const customValidation = (req, res, next) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
        console.log(password === confirm_password);
    }
    else {
        return res.status(400).send({ message: 'error encounter', errors: { password: { message: 'Password is required.' } } });
    }
    next();
};
exports.customValidation = customValidation;
