import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class NftService {
    constructor(private readonly prisma: PrismaClient) {}

    async getNfts(
        addresses: string[],
    ){
        const nftTransfers = await Promise.all(
            addresses.map((i) => {
                return this.prisma.token_transfers.groupBy({
                    by:['token_contract_address_hash','token_id','block_number','log_index'],
                    where:{
                        AND:[
                            {
                                to_address_hash: Buffer.from(i.substring(2), "hex")
                            },
                            {
                                token_id: {
                                    not: null
                                }
                            },
                        ]
                    },
                    orderBy:[
                        { block_number: "desc" },
                        { log_index: "desc" }
                    ]
                }).then(res => {
                    return {accountAddress: i, transfers: res}
                })
            }),
        );
        const nftCollection = await Promise.all(
            nftTransfers.map((account) => {
                return Promise.all(account.transfers.map((nft) => {
                        return new Promise<any>((resolve) => {
                            this.prisma.token_instances.groupBy({
                                by:["metadata","token_contract_address_hash","token_id"],
                                where:{
                                    AND:[
                                        {
                                            token_contract_address_hash: nft.token_contract_address_hash
                                        },
                                        {
                                            token_id: Number(nft.token_id)
                                        }
                                    ]
                                },
                            }).then((res) => {
                                resolve({metadata: res[0].metadata, contractAddress: "0x"+res[0].token_contract_address_hash.toString("hex"), tokenId: res[0].token_id});
                            })
                        })
                    })
                ).then(response => {
                    return {accountDetails: {accountAddress: account.accountAddress, nfts: response}};
                })
            })
        );
        
        return nftCollection;
    }
}