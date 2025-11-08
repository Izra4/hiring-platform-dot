/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { GeneratePRMId } from 'src/common/utils/id-generator';
import { TransactionService } from './trx.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/common/enums/role.enums';
import { TransactionStatus } from 'src/common/enums/trx-status.enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Controller('payment')
export class TransactionController {
  constructor(
    private readonly trxService: TransactionService,
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createPayment(@Req() req: Request) {
    const userinfo = (req as JwtPayload).user;

    this.logger.log(
      `User ${userinfo.sub} attempting to create payment`,
      'TransactionController',
    );

    const userData = await this.usersService.findbyId(userinfo.sub);

    if (userData?.role !== UserRole.RECRUITER) {
      this.logger.warn(
        `Unauthorized payment attempt by user ${userinfo.sub} (role: ${userData?.role})`,
        'TransactionController',
      );
      throw new HttpException(
        {
          success: false,
          message: 'Premium only for company',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const parameter = {
        transaction_details: {
          order_id: GeneratePRMId(),
          gross_amount: 1000000,
        },
        customer_details: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.number || null,
          company: userData.company_created.name,
        },
        item_details: [
          {
            id: 'PRM-1',
            price: 1000000,
            quantity: 1,
            name: 'PREMIUM BOOST',
          },
        ],
        enabled_payments: ['bca_va', 'bri_va'],
      };

      this.logger.log(
        `Creating payment for user ${userinfo.sub} — order ID: ${parameter.transaction_details.order_id}`,
        'TransactionController',
      );

      const payment = await this.trxService.createPayment(parameter);

      await this.trxService.saveTransaction({
        company: userData.company_created.id,
        trx_id: parameter.transaction_details.order_id,
        amount: parameter.transaction_details.gross_amount,
        status: TransactionStatus.PENDING,
      });

      this.logger.log(
        `Payment created successfully for user ${userinfo.sub} — order ID: ${parameter.transaction_details.order_id}`,
        'TransactionController',
      );

      return {
        success: true,
        message: 'Payment link created successfully',
        data: {
          payment_url: payment.redirect_url,
          token: payment.token,
          order_id: parameter.transaction_details.order_id,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to create payment for user ${userinfo.sub}: ${error.message}`,
        error.stack,
        'TransactionController',
      );
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create payment',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('notification')
  async handleNotification(@Body() body: any) {
    const transactionStatus = body.transaction_status;
    const transactionId = body.order_id;
    const settlementTime = body.settlement_time;
    const paymentType = body.payment_type;

    this.logger.log(
      `Received payment notification for order ID: ${transactionId} with status: ${transactionStatus}`,
      'TransactionController',
    );

    try {
      if (transactionStatus === 'settlement') {
        await this.trxService.updateTransaction({
          trx_id: transactionId,
          status: TransactionStatus.SUCCESS,
          payment_type: paymentType,
          payment_date: new Date(settlementTime),
        });
        this.logger.log(
          `Transaction ${transactionId} marked as SUCCESS`,
          'TransactionController',
        );
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'deny' ||
        transactionStatus === 'expire'
      ) {
        this.logger.warn(
          `Transaction ${transactionId} marked as FAILED (${transactionStatus})`,
          'TransactionController',
        );
      }

      return { status: 'ok' };
    } catch (error) {
      this.logger.error(
        `Failed to handle notification for transaction ${transactionId}: ${error.message}`,
        error.stack,
        'TransactionController',
      );
      throw new HttpException(
        {
          success: false,
          message: 'Failed to process notification',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
