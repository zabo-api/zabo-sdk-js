declare const _exports: (api: any) => TradingAPI;
export = _exports;
export type Order = {
    id?: string;
    base_currency?: string;
    quote_currency?: string;
    base_amount?: string;
    buy_or_sell?: 'buy' | 'sell';
    quote_amount?: string;
    price?: string;
    time_in_force?: string;
    ttl?: number;
    provide_liquidity_only?: boolean;
    type?: 'limit' | 'market';
    status?: string;
    created_at?: number;
    done_at?: number;
    done_reason?: string;
    filled_size?: string;
    fill_fees?: string;
    settled?: boolean;
};
export type GetSymbolsResp = [
    {
        base_currency?: string;
        quote_currency?: string;
    }
];
export type GetTickerInfoResp = {
    last_price?: string;
    last_size?: string;
    ask?: string;
    ask_size?: string;
    bid?: string;
    bid_size?: string;
    volume?: string;
    timestamp?: number;
    request_id?: string;
};
export type GetOrdersResp = [Order];
export type GetOrderResp = Order;
export type CreateOrderResp = Pick<Order, 'id' | 'base_currency' | 'quote_currency' | 'buy_or_sell' | 'type' | 'provide_liquidity_only' | 'created_at' | 'status'>;
export type CancelOrdersResp = [string];
export type CancelOrderResp = [string];
export type TradingAPI = Trading;
/**
 * @typedef {{
 *  id?: String
 *  base_currency?: String
 *  quote_currency?: String
 *  base_amount?: String
 *  buy_or_sell?: 'buy' | 'sell'
 *  quote_amount?: String
 *  price?: String
 *  time_in_force?: String
 *  ttl?: Number
 *  provide_liquidity_only?: Boolean
 *  type?: 'limit' | 'market'
 *  status?: String
 *  created_at?: Number
 *  done_at?: Number
 *  done_reason?: String
 *  filled_size?: String
 *  fill_fees?: String
 *  settled?: Boolean
 * }} Order
 *
 * @typedef {[{
 *  base_currency?: String
 *  quote_currency?: String
 * }]} GetSymbolsResp
 *
 * @typedef {{
 *  last_price?: String
 *  last_size?: String
 *  ask?: String
 *  ask_size?: String
 *  bid?: String
 *  bid_size?: String
 *  volume?: String
 *  timestamp?: Number
 *  request_id?: String
 * }} GetTickerInfoResp
 *
 * @typedef {[Order]} GetOrdersResp
 *
 * @typedef {Order} GetOrderResp
 *
 * @typedef {Pick<Order, 'id' | 'base_currency' | 'quote_currency' | 'buy_or_sell' | 'type' | 'provide_liquidity_only' | 'created_at' | 'status'>} CreateOrderResp
 *
 * @typedef {[String]} CancelOrdersResp
 *
 * @typedef {CancelOrdersResp} CancelOrderResp
 */
/**
 * Trading API.
 */
declare class Trading {
    constructor(api: any);
    api: any;
    account: any;
    /**
     * @private
     */
    private _setAccount;
    /**
     * This function returns the trading tickers available at the given account's provider.
     * These pairs can be used in the remaining calls to the Zabo Trading API.
     * @returns {Promise<GetSymbolsResp>} API response.
     */
    getSymbols(): Promise<GetSymbolsResp>;
    /**
     * This function returns the current market information available for the currency pair,
     * at the provider, for the given account.
     * @param {{
     *  baseCurrency: String
     *  quoteCurrency: String
     * }} param0 Request parameters.
     * @returns {Promise<GetTickerInfoResp>} API response.
     */
    getTickerInfo({ baseCurrency, quoteCurrency }?: {
        baseCurrency: string;
        quoteCurrency: string;
    }): Promise<GetTickerInfoResp>;
    /**
     * This function returns all active orders for the given account.
     * @returns {Promise<GetOrdersResp>} API response.
     */
    getOrders(): Promise<GetOrdersResp>;
    /**
     * This function returns the specific order for the given order id.
     * @param {{
     *  orderId: String
     * }} param0 Request parameters.
     * @returns {Promise<GetOrderResp>} API response.
     */
    getOrder({ orderId }?: {
        orderId: string;
    }): Promise<GetOrderResp>;
    /**
     * This function creates a new trade order.
     * @param {{
     *  baseCurrency: String
     *  baseAmount?: String
     *  quoteCurrency: String
     *  quoteAmount?: String
     *  buyOrSell: 'buy' | 'sell'
     *  priceLimit?: String
     *  timeInForce?: String
     *  ttl?: Number
     *  provideLiquidityOnly?: Boolean
     * }} param0 Request parameters.
     * @returns {Promise<CreateOrderResp>} API response.
     */
    createOrder({ baseCurrency, quoteCurrency, buyOrSell, priceLimit, baseAmount, quoteAmount, provideLiquidityOnly, timeInForce, ttl }?: {
        baseCurrency: string;
        baseAmount?: string;
        quoteCurrency: string;
        quoteAmount?: string;
        buyOrSell: 'buy' | 'sell';
        priceLimit?: string;
        timeInForce?: string;
        ttl?: number;
        provideLiquidityOnly?: boolean;
    }): Promise<CreateOrderResp>;
    /**
     * This function cancels all open orders.
     * @returns {Promise<CancelOrdersResp>} API response.
     */
    cancelOrders(): Promise<CancelOrdersResp>;
    /**
     * This function cancels the order with the given order id.
     * @param {{
     *  orderId: String
     * }} param0 Request parameters.
     * @returns {Promise<CancelOrderResp>} API response.
     */
    cancelOrder({ orderId }?: {
        orderId: string;
    }): Promise<CancelOrdersResp>;
}
