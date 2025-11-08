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
} from '@nestjs/common';
import { GeneratePRMId } from 'src/common/utils/id-generator';
import { TransactionService } from './trx.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/common/enums/role.enums';
import { TransactionStatus } from 'src/common/enums/trx-status.enum';

@Controller('payment')
export class TransactionController {
  constructor(
    private readonly trxService: TransactionService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createPayment(@Req() req: Request) {
    const userinfo = (req as JwtPayload).user;
    const userData = await this.usersService.findbyId(userinfo.sub);

    if (userData?.role !== UserRole.RECRUITER) {
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

      const payment = await this.trxService.createPayment(parameter);
      await this.trxService.saveTransaction({
        company: userData.company_created.id,
        trx_id: parameter.transaction_details.order_id,
        amount: parameter.transaction_details.gross_amount,
        status: TransactionStatus.PENDING,
      });

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

    if (transactionStatus === 'settlement') {
      await this.trxService.updateTransaction({
        trx_id: transactionId,
        status: TransactionStatus.SUCCESS,
        payment_type: paymentType,
        payment_date: new Date(settlementTime),
      });
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      // FAILED
      console.log('Payment failed');
    }

    return { status: 'ok' };
  }
}
