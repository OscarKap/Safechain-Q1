"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
/**
 * Stub email service – in production you can replace these with Supabase
 * Storage/Function calls or an external email provider.
 */
const sendVerificationEmail = async (email, token) => {
    // Placeholder – log to console (or Winston) for now
    console.log(`📧 Verification email to ${email}: https://example.com/verify?token=${token}`);
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, token) => {
    console.log(`📧 Password reset email to ${email}: https://example.com/reset?token=${token}`);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=emailService.js.map