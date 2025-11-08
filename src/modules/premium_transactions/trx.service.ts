/* eslint-disable no-useless-catch */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import { TransactionDto, UpdateTransactionDto } from './dto/trx.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrxEntity } from './entities/trx.entity';
import { DataSource, Repository } from 'typeorm';
import { TransactionStatus } from 'src/common/enums/trx-status.enum';
import { CompaniesEntity } from '../companies/entities/companies.entity';
@Injectable()
export class TransactionService {
  private snap: midtransClient.Snap;

  constructor(
    private readonly dataSource: DataSource,
    private configService: ConfigService,
    @InjectRepository(TrxEntity)
    private trxRepository: Repository<TrxEntity>,
  ) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const clientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY');
    const isProduction =
      this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true';

    if (!serverKey || !clientKey) {
      throw new InternalServerErrorException(
        'Midtrans credentials are not configured properly',
      );
    }

    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });
  }

  async createPayment(parameter: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const transaction = await this.snap.createTransaction(parameter);
      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      };
    } catch (error) {
      throw error;
    }
  }

  async saveTransaction(dto: TransactionDto) {
    const data = this.trxRepository.create({
      company: { id: dto.company },
      trx_id: dto.trx_id,
      amount: dto.amount,
      status: dto.status,
    });

    return this.trxRepository.save(data);
  }

  async updateTransaction(dto: UpdateTransactionDto) {
    return await this.dataSource.transaction(async (manager) => {
      const trxRepo = manager.getRepository(TrxEntity);
      const trx = await trxRepo.findOne({
        where: { trx_id: dto.trx_id },
        relations: ['company'],
      });

      if (!trx) {
        throw new Error('Transaction not found');
      }
      await this.trxRepository.update({ trx_id: dto.trx_id }, dto);
      if (dto.status === TransactionStatus.SUCCESS) {
        const companyRepo = manager.getRepository(CompaniesEntity);
        const company = await companyRepo.findOne({
          where: { id: trx.company.id },
        });

        if (company) {
          company.is_premium = true;
          company.premium_expiry_date = new Date(
            new Date().setMonth(new Date().getMonth() + 6),
          );
          await companyRepo.save(company);
        }
      }

      return {
        success: true,
        message: 'Transaction updated successfully',
        data: trx,
      };
    });
  }
}
