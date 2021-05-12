declare const _exports: (api: any) => CurrenciesAPI;
export = _exports;
export type Currency = {
    ticker?: string;
    name?: string;
    type?: string;
    priority?: number;
    logo?: string;
    decimals?: number;
    supporting_providers?: [string];
    address?: string;
    resource_type?: string;
};
export type ExchangeRate = {
    from?: string;
    to?: string;
    rate?: string;
    timestamp?: number;
    resource_type?: string;
};
export type GetListCurrenciesResp = {
    data: [Currency];
    request_id?: string;
};
export type GetOneCurrencyResp = {
    request_id?: string;
} & Currency;
export type GetExchangeRatesResp = {
    data?: [ExchangeRate];
    request_id?: string;
};
export type CurrenciesAPI = Currencies;
/**
 * @typedef {{
 *  ticker?: String
 *  name?: String
 *  type?: String
 *  priority?: Number
 *  logo?: String
 *  decimals?: Number
 *  supporting_providers?: [String]
 *  address?: String
 *  resource_type?: String
 * }} Currency
 *
 * @typedef {{
 *  from?: String
 *  to?: String
 *  rate?: String
 *  timestamp?: Number
 *  resource_type?: String
 * }} ExchangeRate
 *
 * @typedef {{
 *  data?: [Currency?]
 *  request_id?: String
 * }} GetListCurrenciesResp
 *
 * @typedef {{
 *  request_id?: String
 * } & Currency} GetOneCurrencyResp
 *
 * @typedef {{
 *  data?: [ExchangeRate]
 *  request_id?: String
 * }} GetExchangeRatesResp
 */
/**
 * Currencies API.
 */
declare class Currencies {
    constructor(api: any);
    /** @private */
    private api;
    /**
     * This endpoint will return the full list of currencies available in the system.
     * Use the providers endpoint to see the currencies supported by each provider.
     * @param {{
     *  limit?: Number
     *  cursor?: String
     * }} param0 Request parameters.
     * @returns {Promise<GetListCurrenciesResp>} API response.
     */
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<GetListCurrenciesResp>;
    /**
     * This endpoint provides information about a specific currency.
     * @param {String} ticker 3-letter identifier for this currency or asset.
     * @returns {Promise<GetOneCurrencyResp>} API response.
     */
    getOne(ticker: string): Promise<GetOneCurrencyResp>;
    /**
     * This function returns a list of exchange rates for the available cryptocurrencies/assets
     * for a given fiat currency. Currently, USD is the only fiat currency available.
     * Any supported assets can be used for the tickers parameter. This parameter is optional
     * and, if left out, all supported cryptocurrencies/assets will be returned.
     * @param {{
     *  toCrypto?: Boolean
     *  limit?: Number
     *  cursor?: String
     *  tickers?: Array<String> | String
     * }} param0 Request parameters.
     * @returns {Promise<GetExchangeRatesResp>} API response.
     */
    getExchangeRates({ toCrypto, limit, cursor, tickers }?: {
        toCrypto?: boolean;
        limit?: number;
        cursor?: string;
        tickers?: Array<string> | string;
    }): Promise<GetExchangeRatesResp>;
}
