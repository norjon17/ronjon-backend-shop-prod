"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const values_1 = require("../constants/values");
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};
const ShopItemSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'The title field is required.']
    },
    image: {
        type: String,
        required: false,
        default: ''
    },
    imageName: {
        type: String,
        required: false,
        default: ''
    },
    subtitle: {
        type: String,
        required: false,
        default: ''
    },
    recommended: {
        type: Boolean,
        required: false,
        default: false
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    productDetails: {
        type: String,
        required: false,
        default: ''
    },
    material: {
        type: String,
        required: false,
        default: ''
    },
    color: {
        type: String,
        required: false,
        default: ''
    },
    measurements: {
        type: String,
        required: false,
        default: ''
    },
    stocks: {
        type: Number,
        required: false,
        default: 0
    }
}, schemaOptions);
exports.ShopItemModel = mongoose_1.default.model(values_1.TABLES.TB_SHOPITEMS, ShopItemSchema);
