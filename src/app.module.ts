import { Module } from '@nestjs/common';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    NftModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
