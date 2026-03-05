import { z } from 'zod';

export const createAssetSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    type: z.enum(['hardware', 'software', 'cloud', 'digital']),
    category: z.string().optional(),
    serialNumber: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    purchaseDate: z.string().transform((str) => new Date(str)).optional(),
    purchaseCost: z.number().positive().optional(),
    warrantyEndDate: z.string().transform((str) => new Date(str)).optional(),
    location: z.string().optional(),
    specifications: z.record(z.any()).optional(),
  }),
});

export const updateAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    status: z.string().optional(),
    assignedToType: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
    location: z.string().optional(),
  }),
});
