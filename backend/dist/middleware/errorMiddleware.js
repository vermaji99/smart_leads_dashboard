"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (!(err instanceof ApiError_1.default)) {
        statusCode = err.statusCode || 500;
        message = err.message || 'Internal Server Error';
    }
    res.locals.errorMessage = err.message;
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    res.status(statusCode).send(response);
};
exports.default = errorHandler;
