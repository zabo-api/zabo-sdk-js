declare function _exports(api: any): Blockchains;
export = _exports;
declare class Blockchains {
    constructor(api: any);
    api: any;
    getBlock(blockchain: any, blockNumber: any): Promise<any>;
    getContract(blockchain: any, address: any): Promise<any>;
    getTokens(blockchain: any, tokenName: any): Promise<any>;
    getBalances(blockchain: any, address: any): Promise<any>;
    getTransactions(blockchain: any, address: any): Promise<any>;
    getTransaction(blockchain: any, transactionHash: any): Promise<any>;
    getTokenTransfers(blockchain: any, address: any): Promise<any>;
    getTokenTransfer(blockchain: any, transactionHash: any): Promise<any>;
}
