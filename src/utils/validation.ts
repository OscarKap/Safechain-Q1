import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Helper to transform plain request bodies into class instances and validate them.
 * Throws an error object compatible with the errorHandler middleware.
 */
export async function validateDTO<T>(dtoClass: new () => T, plain: object): Promise<T> {
  const instance = plainToInstance(dtoClass, plain);
  const errors: ValidationError[] = await validate(instance as any);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(', '))
      .join('; ');
    // Throw an error that the error handler will catch
    throw { status: 400, message: `Validation failed: ${messages}` };
  }
  return instance;
}
