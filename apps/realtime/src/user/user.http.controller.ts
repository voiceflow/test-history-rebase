import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodApiResponse } from '@voiceflow/nestjs-common';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize, UserID } from '@voiceflow/sdk-auth/nestjs';

import { Membership, MembershipDTO } from './dto/membership.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserHTTPController {
  constructor(@Inject(UserService) private readonly service: UserService) {}

  @Get('with-roles')
  @Authorize.Permissions([Permission.SELF_USER_READ])
  @ZodApiResponse({ status: HttpStatus.OK, schema: MembershipDTO.array() })
  async getSelfRoles(@UserID() userID: number): Promise<Membership[]> {
    return this.service.getSelfRoles(userID);
  }
}
