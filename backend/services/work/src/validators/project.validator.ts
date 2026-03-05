import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().optional(),
    status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).optional(),
    type: z.enum(['fixed-price', 'time-materials', 'retainer', 'internal']).optional(),
    budget: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)).optional(),
    ownerId: z.string().uuid().optional(),
    healthStatus: z.enum(['green', 'yellow', 'red']).optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).optional(),
    type: z.enum(['fixed-price', 'time-materials', 'retainer', 'internal']).optional(),
    budget: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    startDate: z.string().transform((str) => new Date(str)).optional(),
    endDate: z.string().transform((str) => new Date(str)).optional(),
    healthStatus: z.enum(['green', 'yellow', 'red']).optional(),
  }),
});
