import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { NftController } from "./nft.controller";
import { NftService } from "./nft.service";

@Module({
    imports: [],
    controllers: [NftController],
    providers: [
        NftService,
        PrismaClient
    ],
  })
  export class NftModule {}