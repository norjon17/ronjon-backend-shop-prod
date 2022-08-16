"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const logging_1 = __importDefault(require("./config/logging"));
const values_1 = require("./constants/values");
const shopitems_1 = __importDefault(require("./routes/shopitems"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ['GET, POST, PUT, DELETE, OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin']
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '/src/public/images')));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: 'none', secure: true, path: '/' }
}));
mongoose_1.default
    .connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
    .then(() => {
    logging_1.default.info(values_1.NAMESPACE, 'Connected to database.');
})
    .catch((e) => {
    logging_1.default.error(values_1.NAMESPACE, e);
});
app.use('/api/shop', shopitems_1.default);
app.use('/api/auth', auth_1.default);
app.use((req, res) => {
    res.sendStatus(403);
});
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    logging_1.default.info(values_1.NAMESPACE, `Server is running on port http://localhost:${PORT}`);
});
