declare function _exports(api: any): Currencies;
export = _exports;
declare class Currencies {
    constructor(api: any);
    api: any;
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<any>;
    getOne(ticker: any): Promise<any>;
    getExchangeRates({ toCrypto, limit, cursor, tickers }?: {
        toCrypto?: boolean;
        limit?: number;
        cursor?: string;
        tickers?: string;
    }): Promise<any>;
}
