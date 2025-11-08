import { TransactionStatus } from 'src/common/enums/trx-status.enum';
import z from 'zod';

export const TransactionSchema = z.object({
  company: z.string(),
  trx_id: z.string(),
  amount: z.number(),
  status: z.enum(TransactionStatus).default(TransactionStatus.PENDING),
});

export const UpdateTransactionSchema = z.object({
  trx_id: z.string(),
  status: z.enum(TransactionStatus).default(TransactionStatus.PENDING),
  payment_type: z.string(),
  payment_date: z.date().default(() => new Date()),
});

export type TransactionDto = z.infer<typeof TransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
