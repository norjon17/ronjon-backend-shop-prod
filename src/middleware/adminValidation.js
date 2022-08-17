"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidation = void 0;
const passwordValidation = (req, res, next) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
        if (password !== confirm_password) {
            return res.status(400).send({ message: 'error encountered', errors: { password: { message: `Password don't match.` } } });
        }
        next();
    }
    else {
        next();
    }
};
exports.passwordValidation = passwordValidation;
