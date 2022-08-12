"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.token = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (!err) {
                req.body.id = decode.id;
                next();
            }
            else {
                return res.status(403).json({ err });
            }
        });
    }
    else {
        return res.status(401).send();
    }
};
exports.verifyJWT = verifyJWT;
const token = (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null) {
        return res.sendStatus(401);
    }
    else {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (!err) {
                const id = decode.id;
                const accessToken = (0, exports.generateAccessToken)(id);
            }
            else {
                return res.status(403).json({ err });
            }
        });
    }
};
exports.token = token;
const generateAccessToken = (id) => {
    return jsonwebtoken_1.default.sign(id, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};
exports.generateAccessToken = generateAccessToken;
