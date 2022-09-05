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
const ShopItemModel_1 = require("../models/ShopItemModel");
const cookieJWT_1 = require("../middleware/cookieJWT");
const multer_1 = __importDefault(require("multer"));
const fb_1 = require("../services/test/fb");
const route = (0, express_1.default)();
const opts = { runValidators: true };
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
route.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield ShopItemModel_1.ShopItemModel.find();
        res.send({ items: data });
    }
    catch (e) {
        res.send(e);
    }
}));
route.get('/read/:id', cookieJWT_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield ShopItemModel_1.ShopItemModel.findById(id);
        res.send({ item: data });
    }
    catch (e) {
        res.send(e);
    }
}));
route.post('/create', cookieJWT_1.verifyJWT, upload.single('imageFile'), fb_1.uploadImage, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { firebaseUrl, imageName } = req.body;
    console.log('saving...');
    const doc = new ShopItemModel_1.ShopItemModel(Object.assign(Object.assign({}, data), { image: firebaseUrl, imageName: imageName }));
    try {
        yield doc.save();
        logging_1.default.info(`SHOP ITEMS CREATE`, `Data has been inserted.`);
        return res.status(200).json({ message: 'inserted' });
    }
    catch (e) {
        logging_1.default.error(`SHOP ITEMS CREATE`, `${e}`);
        return res.status(400).send(Object.assign({ message: 'Error encoutered' }, e));
    }
}));
route.put('/updateone/:id', cookieJWT_1.verifyJWT, upload.single('imageFile'), fb_1.uploadImage, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const data = req.body;
    logging_1.default.info('UPDATE', JSON.stringify(data));
    const { firebaseUrl, imageName } = req.body;
    try {
        if (JSON.stringify(data) === JSON.stringify({})) {
            return res.status(403).json({ message: 'Invalid input. Please try again.' });
        }
        if (!data.title || /^\s*$/.test(data.title)) {
            return res.status(403).json({ message: 'Error encountered.', errors: { title: { message: 'The title field is required.' } } });
        }
        const currentShopItem = ShopItemModel_1.ShopItemModel.findById(_id);
        !currentShopItem && res.status(403).json({ message: 'Something went wrong. Please try again' });
        yield ShopItemModel_1.ShopItemModel.findByIdAndUpdate(_id, Object.assign(Object.assign({}, data), { image: firebaseUrl, imageName: imageName }), opts);
        return res.status(200).json({ message: 'updated' });
    }
    catch (e) {
        logging_1.default.error(`SHOP ITEMS UPDATE ONE`, `${e}`);
        return res.status(403).json(Object.assign({ message: 'Error encountered' }, e));
    }
}));
route.delete('/deleteone/:id', cookieJWT_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield ShopItemModel_1.ShopItemModel.findById(id);
        if (data) {
            if (data.imageName !== '') {
                const file = fb_1.bucket.file(fb_1.IMAGE_PATH + data.imageName);
                yield file.delete();
            }
            yield data.deleteOne();
            return res.status(200).json({ message: 'deleted' });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (e) {
        logging_1.default.error(values_1.NAMESPACE, `${e}`);
        return res.status(403).json({ message: 'Something went wrong. Please try again' });
    }
}));
exports.default = route;
