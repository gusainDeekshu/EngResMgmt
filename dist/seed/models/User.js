"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['engineer', 'manager'], required: true },
    skills: [{ type: String }],
    seniority: { type: String, enum: ['junior', 'mid', 'senior'] },
    maxCapacity: { type: Number },
    department: { type: String },
    password: { type: String },
});
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
