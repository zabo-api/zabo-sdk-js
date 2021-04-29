declare function _exports(api: any): Transactions;
export = _exports;
declare class Transactions {
    constructor(api: any);
    api: any;
    account: any;
    _setAccount(account: any): void;
    getOne({ userId, accountId, txId }?: {
        userId: any;
        accountId: any;
        txId: any;
    }): Promise<any>;
    getList({ userId, accountId, ticker, limit, cursor }?: {
        userId: any;
        accountId: any;
        ticker?: string;
        limit?: number;
        cursor?: string;
    }): Promise<any>;
}
