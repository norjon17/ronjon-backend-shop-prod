"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("../config/logging"));
const values_1 = require("../constants/values");
const AuthModel_1 = require("../models/AuthModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieJWT_1 = require("../middleware/cookieJWT");
const multer_1 = __importDefault(require("multer"));
const route = (0, express_1.default)();
const upload = (0, multer_1.default)();
route.get('/', cookieJWT_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    try {
        const admin = yield AuthModel_1.AuthModel.findById(id);
        if (admin) {
            return res.send({ message: 'access', admin });
        }
        else {
            return res.status(404).send({ message: 'denied' });
        }
    }
    catch (e) {
        logging_1.default.error(values_1.NAMESPACE, JSON.stringify(e));
        return res.send(Object.assign({ message: 'denied' }, e));
    }
}));
route.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAdmin = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(oldAdmin.password, salt);
        const newAdmin = Object.assign(Object.assign({}, oldAdmin), { password: hashPassword });
        const createAdmin = new AuthModel_1.AuthModel(Object.assign({}, newAdmin));
        yield createAdmin.save();
        logging_1.default.info(values_1.NAMESPACE, `New admin created ${newAdmin.firstname} ${newAdmin.lastname} ${newAdmin.email}`);
        next();
    }
    catch (e) {
        logging_1.default.error(values_1.NAMESPACE, JSON.stringify(e));
        if (e.code === 11000) {
            res.send({ message: 'error encountered', errors: { email: { message: 'This email is already used in this site.' } } });
        }
        else {
            res.send(Object.assign({ message: 'error encountered' }, e));
        }
    }
}));
route.post('/login', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const adminData = yield AuthModel_1.AuthModel.findOne({ email: email });
        if (adminData) {
            const validPassword = yield bcrypt_1.default.compare(password, adminData.password);
            let admin = adminData;
            admin.password = '';
            if (validPassword) {
                const id = admin.id;
                const token = (0, cookieJWT_1.generateAccessToken)(id);
                const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
                res
                    .cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    path: '/'
                })
                    .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    path: '/'
                })
                    .send({ admin });
            }
            else {
                res.status(403).json({ message: 'Wrong email or password.' });
            }
        }
        else {
            res.status(403).json({ message: 'Wrong email or password.' });
        }
    }
    catch (e) {
        logging_1.default.error(values_1.NAMESPACE, JSON.stringify(e));
        res.status(403).json(Object.assign({ message: 'error encountered' }, e));
    }
}));
route.delete('/logout', cookieJWT_1.verifyJWT, (req, res) => {
    return res
        .cookie('refreshToken', null, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
    })
        .cookie('token', null, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
    })
        .send();
});
exports.default = route;
