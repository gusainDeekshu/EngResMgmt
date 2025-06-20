"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AssignmentSchema = new mongoose_1.Schema({
    engineerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    allocationPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    role: { type: String, required: true },
});
exports.default = mongoose_1.default.models.Assignment || mongoose_1.default.model('Assignment', AssignmentSchema);
