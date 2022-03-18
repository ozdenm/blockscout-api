import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { NftService } from "./nft.service";

@Controller()
export class NftController {
    constructor(private readonly nftService: NftService){}

    @HttpCode(200)
    @Post(':nodeName/nft/')
    async moralisGetNftsForAddress(
        @Param('nodeName') nodeName: string,
        @Body() addresses: string[],
    ): Promise<any> {
        return this.nftService.getNfts(addresses);
    }
}
