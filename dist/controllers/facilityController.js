"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacilitiesHandler = exports.createFacilityHandler = void 0;
const facilityService_1 = require("../services/facilityService");
const logger_1 = __importDefault(require("../config/logger"));
/** POST /api/facilities */
const createFacilityHandler = async (req, res, next) => {
    try {
        const facility = await (0, facilityService_1.createFacility)(req.body);
        logger_1.default.info('Facility created', { id: facility.id });
        res.status(201).json(facility);
    }
    catch (e) {
        next(e);
    }
};
exports.createFacilityHandler = createFacilityHandler;
/** GET /api/facilities */
const getFacilitiesHandler = async (req, res, next) => {
    try {
        const result = await (0, facilityService_1.getFacilities)({
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            province: req.query.province,
            district: req.query.district,
            type: req.query.type,
        });
        res.json(result);
    }
    catch (e) {
        next(e);
    }
};
exports.getFacilitiesHandler = getFacilitiesHandler;
//# sourceMappingURL=facilityController.js.map