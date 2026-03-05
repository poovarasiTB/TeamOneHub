import { z } from 'zod';

export const createInvoiceSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    items: z.array(z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      taxRate: z.number().min(0).max(100).optional(),
    })).min(1),
    dueDate: z.string().transform((str) => new Date(str)),
    notes: z.string().optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    customerId: z.string().uuid().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
    dueDate: z.string().transform((str) => new Date(str)).optional(),
    notes: z.string().optional(),
  }),
});
