import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(1).max(500),
    description: z.string().min(1),
    type: z.enum(['incident', 'service-request', 'problem', 'change']).optional(),
    category: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    channelId: z.string().optional(),
    requesterEmail: z.string().email().optional(),
    requesterName: z.string().optional(),
    assigneeId: z.string().uuid().optional(),
    assetId: z.string().uuid().optional(),
  }),
});

export const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    subject: z.string().min(1).max(500).optional(),
    description: z.string().optional(),
    status: z.enum(['new', 'open', 'pending', 'on-hold', 'resolved', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assigneeId: z.string().uuid().optional(),
  }),
});
