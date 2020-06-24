"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var PageAnalyzer_1 = __importDefault(require("../controllers/PageAnalyzer"));
var router = express_1.Router();
exports.lucyJs = function (req, res) {
    res.send('Lucy says - Hello!');
};
router.get('/lucyjs', exports.lucyJs);
router.get('/lucyjs/test', PageAnalyzer_1.default.runTest);
exports.default = router;
