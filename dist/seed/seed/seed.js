"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var User_1 = require("../models/User");
var Project_1 = require("../models/Project");
var Assignment_1 = require("../models/Assignment");
var db_1 = require("../lib/db");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var engineers, _a, _b, _c, manager, _d, _e, projects;
        var _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectToDatabase)()];
                case 1:
                    _l.sent();
                    return [4 /*yield*/, User_1.default.deleteMany({})];
                case 2:
                    _l.sent();
                    return [4 /*yield*/, Project_1.default.deleteMany({})];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, Assignment_1.default.deleteMany({})];
                case 4:
                    _l.sent();
                    _b = (_a = User_1.default).insertMany;
                    _f = {
                        email: "alice@company.com",
                        name: "Alice Johnson",
                        role: "engineer",
                        skills: ["React", "TypeScript"],
                        seniority: "senior",
                        maxCapacity: 100,
                        department: "Frontend"
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash("password123", 10)];
                case 5:
                    _c = [
                        (_f.password = _l.sent(),
                            _f)
                    ];
                    _g = {
                        email: "bob@company.com",
                        name: "Bob Lee",
                        role: "engineer",
                        skills: ["Node.js", "MongoDB"],
                        seniority: "mid",
                        maxCapacity: 100,
                        department: "Backend"
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash("password123", 10)];
                case 6:
                    _c = _c.concat([
                        (_g.password = _l.sent(),
                            _g)
                    ]);
                    _h = {
                        email: "priya@company.com",
                        name: "Priya Singh",
                        role: "engineer",
                        skills: ["React", "Node.js"],
                        seniority: "junior",
                        maxCapacity: 50,
                        department: "Fullstack"
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash("password123", 10)];
                case 7:
                    _c = _c.concat([
                        (_h.password = _l.sent(),
                            _h)
                    ]);
                    _j = {
                        email: "carlos@company.com",
                        name: "Carlos Diaz",
                        role: "engineer",
                        skills: ["AWS", "Docker"],
                        seniority: "senior",
                        maxCapacity: 50,
                        department: "DevOps"
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash("password123", 10)];
                case 8: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                            (_j.password = _l.sent(),
                                _j)
                        ])])];
                case 9:
                    engineers = _l.sent();
                    _e = (_d = User_1.default).create;
                    _k = {
                        email: "manager@company.com",
                        name: "Jane Manager",
                        role: "manager"
                    };
                    return [4 /*yield*/, bcryptjs_1.default.hash("adminpass", 10)];
                case 10: return [4 /*yield*/, _e.apply(_d, [(_k.password = _l.sent(),
                            _k)])];
                case 11:
                    manager = _l.sent();
                    return [4 /*yield*/, Project_1.default.insertMany([
                            {
                                name: "Website Redesign",
                                description: "Revamp the company website UI/UX.",
                                startDate: new Date("2025-06-01"),
                                endDate: new Date("2025-07-15"),
                                requiredSkills: ["React", "TypeScript"],
                                teamSize: 2,
                                status: "active",
                                managerId: manager._id,
                            },
                            {
                                name: "API Overhaul",
                                description: "Refactor backend APIs for performance.",
                                startDate: new Date("2025-06-10"),
                                endDate: new Date("2025-08-01"),
                                requiredSkills: ["Node.js", "MongoDB"],
                                teamSize: 2,
                                status: "planning",
                                managerId: manager._id,
                            },
                            {
                                name: "Cloud Migration",
                                description: "Move infrastructure to AWS.",
                                startDate: new Date("2025-06-20"),
                                endDate: new Date("2025-09-01"),
                                requiredSkills: ["AWS", "Docker"],
                                teamSize: 2,
                                status: "active",
                                managerId: manager._id,
                            },
                        ])];
                case 12:
                    projects = _l.sent();
                    // Assignments
                    return [4 /*yield*/, Assignment_1.default.insertMany([
                            {
                                engineerId: engineers[0]._id,
                                projectId: projects[0]._id,
                                allocationPercentage: 60,
                                startDate: new Date("2025-06-01"),
                                endDate: new Date("2025-07-15"),
                                role: "Frontend Developer",
                            },
                            {
                                engineerId: engineers[1]._id,
                                projectId: projects[1]._id,
                                allocationPercentage: 50,
                                startDate: new Date("2025-06-10"),
                                endDate: new Date("2025-08-01"),
                                role: "Backend Developer",
                            },
                            {
                                engineerId: engineers[2]._id,
                                projectId: projects[0]._id,
                                allocationPercentage: 40,
                                startDate: new Date("2025-06-01"),
                                endDate: new Date("2025-07-15"),
                                role: "Fullstack Developer",
                            },
                            {
                                engineerId: engineers[2]._id,
                                projectId: projects[1]._id,
                                allocationPercentage: 10,
                                startDate: new Date("2025-06-10"),
                                endDate: new Date("2025-08-01"),
                                role: "Fullstack Developer",
                            },
                            {
                                engineerId: engineers[3]._id,
                                projectId: projects[2]._id,
                                allocationPercentage: 50,
                                startDate: new Date("2025-06-20"),
                                endDate: new Date("2025-09-01"),
                                role: "DevOps Engineer",
                            },
                            {
                                engineerId: engineers[1]._id,
                                projectId: projects[2]._id,
                                allocationPercentage: 30,
                                startDate: new Date("2025-06-20"),
                                endDate: new Date("2025-09-01"),
                                role: "Backend Developer",
                            },
                        ])];
                case 13:
                    // Assignments
                    _l.sent();
                    console.log("Seed data inserted!");
                    mongoose_1.default.connection.close();
                    return [2 /*return*/];
            }
        });
    });
}
seed();
