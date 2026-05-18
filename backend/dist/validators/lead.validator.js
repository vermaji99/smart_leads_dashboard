"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../constants/enums");
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().min(10, 'Phone number must be at least 10 characters'),
        company: zod_1.z.string().min(2, 'Company must be at least 2 characters'),
        status: zod_1.z.nativeEnum(enums_1.LeadStatus).optional(),
        source: zod_1.z.nativeEnum(enums_1.LeadSource),
        notes: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }),
});
exports.updateLeadSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lead ID'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).optional(),
        company: zod_1.z.string().min(2).optional(),
        status: zod_1.z.nativeEnum(enums_1.LeadStatus).optional(),
        source: zod_1.z.nativeEnum(enums_1.LeadSource).optional(),
        notes: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    }),
});
