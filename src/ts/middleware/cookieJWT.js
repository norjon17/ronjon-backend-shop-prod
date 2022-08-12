"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logging_1 = __importDefault(require("../config/logging"));
const values_1 = require("../constants/values");
const verifyJWT = (req, res, next) => {
    const token = req.session.cookies.token;
    const refreshToken = req.session.cookies.refreshToken;
    try {
        let tokenExpired = false;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
                if (!err) {
                    logging_1.default.info(values_1.NAMESPACE, 'TOKEN OK');
                    req.body.id = decode.id;
                    next();
                }
                else {
                    logging_1.default.error(values_1.NAMESPACE, 'TOKEN DENIED');
                    tokenExpired = true;
                }
            });
        }
        if (refreshToken === undefined) {
            return res.sendStatus(403);
        }
        if (tokenExpired && refreshToken) {
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
                if (!err) {
                    logging_1.default.info(values_1.NAMESPACE, 'REFRESH TOKEN OK');
                    req.body.id = decode.id;
                    next();
                }
                else {
                    logging_1.default.error(values_1.NAMESPACE, 'REFRESH TOKEN ERROR');
                    return res.status(403).json({ message: 'refresh token?', err });
                }
            });
        }
    }
    catch (err) {
        return res.status(403).json({ message: 'normal error', err });
    }
};
exports.verifyJWT = verifyJWT;
const generateAccessToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};
exports.generateAccessToken = generateAccessToken;
