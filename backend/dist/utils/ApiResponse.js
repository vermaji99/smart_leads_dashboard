"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(statusCode, data, message = 'Success', meta = {}) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
}
exports.default = ApiResponse;
