import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    type: z.enum(['individual', 'company']),
    name: z.string().min(1).max(200),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    taxId: z.string().optional(),
    billingAddress: z.string().optional(),
    shippingAddress: z.string().optional(),
    creditLimit: z.number().positive().optional(),
    paymentTerms: z.string().optional(),
  }),
});
