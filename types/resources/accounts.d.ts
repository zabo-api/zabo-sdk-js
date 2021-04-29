declare function _exports(api: any): Accounts;
export = _exports;
declare class Accounts {
    constructor(api: any);
    api: any;
    id: any;
    data: any;
    _setAccount(account: any): void;
    get(): Promise<any>;
    create({ clientId, credentials, provider, origin }?: {
        clientId: any;
        credentials: any;
        provider: any;
        origin: any;
    }): Promise<any>;
    getBalances({ tickers }?: {
        tickers: any;
    }): Promise<any>;
    createDepositAddress(ticker: any): Promise<any>;
    getDepositAddresses(ticker: any): Promise<any>;
}
