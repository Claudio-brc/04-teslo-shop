import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Reset the database and load the initial catalog',
  })
  @ApiOkResponse({
    description: 'Seed completed successfully',
    schema: { type: 'string', example: 'SEED EXECUTED' },
  })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
