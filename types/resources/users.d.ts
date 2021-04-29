declare function _exports(api: any): Users;
export = _exports;
declare class Users {
    constructor(api: any);
    api: any;
    create(account?: {}): Promise<any>;
    addAccount(user?: {}, account?: {}): Promise<any>;
    removeAccount({ userId, accountId }: {
        userId: any;
        accountId: any;
    }): Promise<any>;
    getOne(id: any): Promise<any>;
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<any>;
    getAccount({ userId, accountId }?: {
        userId: any;
        accountId: any;
    }): Promise<any>;
    getBalances({ userId, accountId, tickers }?: {
        userId: any;
        accountId: any;
        tickers: any;
    }): Promise<any>;
    createDepositAddress({ userId, accountId, ticker }?: {
        userId: any;
        accountId: any;
        ticker: any;
    }): Promise<any>;
    getDepositAddresses({ userId, accountId, ticker }?: {
        userId: any;
        accountId: any;
        ticker: any;
    }): Promise<any>;
}
