"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = validateDTO;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Helper to transform plain request bodies into class instances and validate them.
 * Throws an error object compatible with the errorHandler middleware.
 */
async function validateDTO(dtoClass, plain) {
    const instance = (0, class_transformer_1.plainToInstance)(dtoClass, plain);
    const errors = await (0, class_validator_1.validate)(instance);
    if (errors.length > 0) {
        const messages = errors
            .map((e) => Object.values(e.constraints || {}).join(', '))
            .join('; ');
        // Throw an error that the error handler will catch
        throw { status: 400, message: `Validation failed: ${messages}` };
    }
    return instance;
}
//# sourceMappingURL=validation.js.map