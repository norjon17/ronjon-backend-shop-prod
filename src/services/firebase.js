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
exports.uploadImage = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const logging_1 = __importDefault(require("../config/logging"));
const firebase_dev_json_1 = __importDefault(require("../config/firebase-dev.json"));
const BUCKET = 'ronjon-clothes-shop-dev.appspot.com';
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_dev_json_1.default),
    storageBucket: BUCKET
});
const bucket = firebase_admin_1.default.storage().bucket();
const uploadImage = (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        const imgFile = req.file;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const imgName = `${imgFile.fieldname}-${uniqueSuffix}${path_1.default.extname(imgFile.originalname)}`;
        const file = bucket.file('images/shop_items/' + imgName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: imgFile.mimetype
            }
        });
        stream.on('error', (e) => {
            logging_1.default.error('FIREBASE UPLOAD', e);
        });
        stream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            yield file.makePublic();
            req.body.firebaseUrl = file.publicUrl();
            next();
        }));
        stream.end(imgFile.buffer);
    }
    else {
        next();
    }
};
exports.uploadImage = uploadImage;
