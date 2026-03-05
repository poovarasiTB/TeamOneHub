import { describe, it, expect } from 'vitest';
import { validateForm, emailSchema, passwordSchema, createProjectSchema } from '../utils/validation';

describe('Validation', () => {
  describe('emailSchema', () => {
    it('validates valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('rejects empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('validates strong password', () => {
      const result = passwordSchema.safeParse('StrongPassword123!');
      expect(result.success).toBe(true);
    });

    it('rejects password without uppercase', () => {
      const result = passwordSchema.safeParse('lowercase123!');
      expect(result.success).toBe(false);
    });

    it('rejects password without lowercase', () => {
      const result = passwordSchema.safeParse('UPPERCASE123!');
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const result = passwordSchema.safeParse('NoNumbers!');
      expect(result.success).toBe(false);
    });

    it('rejects password without special character', () => {
      const result = passwordSchema.safeParse('NoSpecial123');
      expect(result.success).toBe(false);
    });

    it('rejects password less than 8 characters', () => {
      const result = passwordSchema.safeParse('Short1!');
      expect(result.success).toBe(false);
    });
  });

  describe('createProjectSchema', () => {
    it('validates valid project', () => {
      const result = createProjectSchema.safeParse({
        name: 'Test Project',
        type: 'internal',
        status: 'planning',
        currency: 'USD',
        startDate: '2026-01-01',
        healthStatus: 'green',
      });
      expect(result.success).toBe(true);
    });

    it('rejects project without name', () => {
      const result = createProjectSchema.safeParse({
        name: '',
        type: 'internal',
      });
      expect(result.success).toBe(false);
    });

    it('rejects project with invalid type', () => {
      const result = createProjectSchema.safeParse({
        name: 'Test Project',
        type: 'invalid-type',
      });
      expect(result.success).toBe(false);
    });

    it('rejects project with invalid status', () => {
      const result = createProjectSchema.safeParse({
        name: 'Test Project',
        status: 'invalid-status',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('returns success for valid data', () => {
      const result = validateForm(emailSchema, 'test@example.com');
      expect(result.success).toBe(true);
      expect(result.data).toBe('test@example.com');
    });

    it('returns errors for invalid data', () => {
      const result = validateForm(emailSchema, 'invalid-email');
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});
