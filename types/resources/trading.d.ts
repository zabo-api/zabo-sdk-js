declare function _exports(api: any): Trading;
export = _exports;
declare class Trading {
    constructor(api: any);
    api: any;
    account: any;
    _setAccount(account: any): void;
    getSymbols(): Promise<any>;
    getTickerInfo({ baseCurrency, quoteCurrency }?: {
        baseCurrency: any;
        quoteCurrency: any;
    }): Promise<any>;
    getOrders(): Promise<any>;
    getOrder({ orderId }?: {
        orderId: any;
    }): Promise<any>;
    createOrder({ baseCurrency, quoteCurrency, buyOrSell, priceLimit, baseAmount, quoteAmount, provideLiquidityOnly, timeInForce, ttl }?: {
        baseCurrency: any;
        quoteCurrency: any;
        buyOrSell: any;
        priceLimit: any;
        baseAmount: any;
        quoteAmount: any;
        provideLiquidityOnly: any;
        timeInForce: any;
        ttl: any;
    }): Promise<any>;
    cancelOrders(): Promise<any>;
    cancelOrder({ orderId }?: {
        orderId: any;
    }): Promise<any>;
}
