"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facilityController_1 = require("../controllers/facilityController");
const router = (0, express_1.Router)();
router.post('/', facilityController_1.createFacilityHandler);
router.get('/', facilityController_1.getFacilitiesHandler);
exports.default = router;
//# sourceMappingURL=facility.js.map