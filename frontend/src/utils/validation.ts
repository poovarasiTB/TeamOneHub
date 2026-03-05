import { z } from 'zod';

/**
 * Comprehensive form validation schemas
 */

// Email validation
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

// Password validation (strong password)
export const passwordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// Phone validation
export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be less than 20 digits');

// Name validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// URL validation
export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL must be less than 2048 characters');

// Date validation
export const dateSchema = z.string()
  .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format');

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(200, 'Project name must be less than 200 characters'),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  type: z.enum(['fixed-price', 'time-materials', 'retainer', 'internal']),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  budget: z.number()
    .positive('Budget must be positive')
    .max(1000000000, 'Budget too large')
    .optional(),
  currency: z.string().length(3, 'Invalid currency code'),
  startDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid start date'),
  endDate: z.string().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }).optional(),
  healthStatus: z.enum(['green', 'yellow', 'red']),
});

export const updateProjectSchema = createProjectSchema.partial();

// Employee validation schemas
export const createEmployeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  joinDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid join date'),
  status: z.enum(['active', 'on-leave', 'terminated', 'resigned']),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// Invoice validation schemas
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  taxRate: z.number().min(0).max(100).optional(),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid due date'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

// Ticket validation schemas
export const createTicketSchema = z.object({
  subject: z.string()
    .min(1, 'Subject is required')
    .max(500, 'Subject must be less than 500 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters'),
  type: z.enum(['incident', 'service-request', 'problem', 'change']),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().uuid().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();

// User validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  tenantName: z.string().min(1, 'Company name is required'),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Utility functions for validation
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((error) => {
      const key = error.path.join('.');
      errors[key] = error.message;
    });
    
    return {
      success: false,
      errors,
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

export type { z };
