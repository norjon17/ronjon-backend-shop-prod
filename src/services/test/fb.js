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
exports.imageDelete = exports.uploadImage = exports.bucket = exports.IMAGE_PATH = exports.BUCKET = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const logging_1 = __importDefault(require("../../config/logging"));
const values_1 = require("../../constants/values");
const firebase_dev_json_1 = __importDefault(require("../../config/firebase-dev.json"));
exports.BUCKET = 'ronjon-clothes-shop-dev.appspot.com';
exports.IMAGE_PATH = 'images/shop_items/';
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebase_dev_json_1.default),
    storageBucket: exports.BUCKET
});
exports.bucket = firebase_admin_1.default.storage().bucket();
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const imgFile = req.file;
        const { imageName } = req.body;
        console.log(imageName);
        if (imageName) {
            console.log('deleting existing image');
            const file = exports.bucket.file(exports.IMAGE_PATH + imageName);
            yield file.delete();
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const imgName = `${imgFile.fieldname}-${uniqueSuffix}${path_1.default.extname(imgFile.originalname)}`;
        const file = exports.bucket.file(exports.IMAGE_PATH + imgName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: imgFile.mimetype
            }
        });
        stream.on('error', (e) => {
            logging_1.default.error(values_1.NAMESPACE, e);
        });
        stream.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            yield file.makePublic();
            req.body.firebaseUrl = file.publicUrl();
            req.body.imageName = imgName;
            next();
        }));
        stream.end(imgFile.buffer);
    }
    else {
        next();
    }
});
exports.uploadImage = uploadImage;
const imageDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageName } = req.body;
    console.log(imageName);
    const file = exports.bucket.file(exports.IMAGE_PATH + imageName);
    try {
        yield file.delete();
        next();
    }
    catch (e) {
        next();
    }
});
exports.imageDelete = imageDelete;
