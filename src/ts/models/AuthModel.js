"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const values_1 = require("../constants/values");
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};
const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};
const AuthSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: [true, 'The first name field is required.']
    },
    lastname: {
        type: String,
        required: [true, 'The last name field is required.']
    },
    middlename: {
        type: String,
        required: [true, 'The middle name field is required.']
    },
    email: {
        type: String,
        required: [true, 'The email field is required.'],
        unique: true,
        email: true,
        lowercase: true,
        validate: [validateEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'The password field is required.'],
        min: 6
    },
    birthday: {
        type: Date,
        required: [true, 'The birthday field is required.']
    }
}, schemaOptions);
exports.AuthModel = mongoose_1.default.model(values_1.TABLES.TB_ADMINS, AuthSchema);
