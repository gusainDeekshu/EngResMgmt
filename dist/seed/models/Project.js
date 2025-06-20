"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    requiredSkills: [{ type: String }],
    teamSize: { type: Number },
    status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
    managerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
});
exports.default = mongoose_1.default.models.Project || mongoose_1.default.model('Project', ProjectSchema);
