/**
 * Stub email service – in production you can replace these with Supabase
 * Storage/Function calls or an external email provider.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  // Placeholder – log to console (or Winston) for now
  console.log(`📧 Verification email to ${email}: https://example.com/verify?token=${token}`);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  console.log(`📧 Password reset email to ${email}: https://example.com/reset?token=${token}`);
};
