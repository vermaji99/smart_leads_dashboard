"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                path: issue.path.map((p) => String(p)).join('.'),
                message: issue.message,
            }));
            return next(new ApiError_1.default(400, 'Validation Error', errorMessages));
        }
        return next(new ApiError_1.default(500, 'Internal Server Error'));
    }
};
exports.default = validate;
