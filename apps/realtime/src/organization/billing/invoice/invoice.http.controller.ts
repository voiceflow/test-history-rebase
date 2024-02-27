import { Controller, Get, HttpStatus, Inject, Param, Redirect } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { BillingInvoiceService } from './invoice.service';

@Controller(':organizationID/billing/invoice')
@ApiTags('Billing/Invoice')
export class BillingInvoiceHTTPController {
  constructor(
    @Inject(BillingInvoiceService)
    private readonly service: BillingInvoiceService
  ) {}

  @Get(':invoiceID/pdf')
  @Redirect()
  @ApiOperation({
    summary: 'Redirects to the invoice PDF',
    description: 'Redirects to the invoice PDF for the given invoiceID',
  })
  @ApiParam({ name: 'organizationID', type: 'string' })
  @ApiParam({ name: 'invoiceID', type: 'string' })
  async getInvoicePDF(@Param('invoiceID') invoiceID: string) {
    const { url } = await this.service.getInvoicePDF(invoiceID);

    return {
      url,
      status: HttpStatus.FOUND,
    };
  }
}
