"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLES = exports.NAMESPACE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.NAMESPACE = 'SHOP SERVER';
var TABLES;
(function (TABLES) {
    TABLES["TB_SHOPITEMS"] = "tb_shopitems";
    TABLES["TB_ADMIN_ACCESS"] = "tb_admin_access";
    TABLES["TB_ADMINS"] = "tb_admins";
})(TABLES = exports.TABLES || (exports.TABLES = {}));
