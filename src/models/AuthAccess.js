"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAccessModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const values_1 = require("../constants/values");
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};
mongoose_1.default.pluralize(null);
const AuthAccessScema = new mongoose_1.default.Schema({
    access_id: {
        type: String,
        required: true
    }
}, schemaOptions);
exports.AuthAccessModel = mongoose_1.default.model(values_1.TABLES.TB_ADMIN_ACCESS, AuthAccessScema);
