declare const _exports: (api: any) => AccountsAPI;
export = _exports;
export type GetAccountBalancesResp = {
    data?: [import('./users').Balance];
    request_id?: string;
};
export type AccountsAPI = Accounts;
/**
 * @typedef {{
 *  data?: [import('./users').Balance]
 *  request_id?: String
 * }} GetAccountBalancesResp
 */
/**
 * Accounts API.
 */
declare class Accounts {
    constructor(api: any);
    /** @private */
    private api;
    id: any;
    data: any;
    /**
     * @private
     */
    private _setAccount;
    get(): Promise<any>;
    create({ clientId, credentials, provider, origin }?: {
        clientId: any;
        credentials: any;
        provider: any;
        origin: any;
    }): Promise<any>;
    /**
     * Returns the user balances for the requested currencies. When requesting balances from the client,
     * the request should be made in the context of the connected account. When requesting from an
     * application server, requests should be made in the context of a user. See documentation about
     * users. Cryptocurrencies available to your app can be queried. If no currencies are specified,
     * then all available currencies will be returned.
     * @param {{
     *  tickers?: [String]
     * }} param0 Request parameters.
     * @returns {Promise<GetAccountBalancesResp>} API response.
     */
    getBalances({ tickers }?: {
        tickers?: [string];
    }): Promise<GetAccountBalancesResp>;
    /**
     * This endpoint will create and return a deposit address for the specified account.
     * If the currency is not supported by the connected provider, you will receive an 'unsupported' error.
     * See Unsupported Functions for more information.
     * @param {String} ticker Three-letter identifier for the currency this deposit address should be used for.
     * @returns {Promise<import('./users').CreateDepositAddressResp>} API response.
     */
    createDepositAddress(ticker: string): Promise<import('./users').CreateDepositAddressResp>;
    /**
     * This endpoint will retrieve all deposit addresses for the specified account.
     * If the currency is not supported by the connected provider, you will receive
     * an 'unsupported' error. See Unsupported Functions for more information.
     * @param {String} ticker Three-letter identifier for the currency this deposit address should be used for.
     * @returns {Promise<import('./users').GetDepositAddressesResp>}
     */
    getDepositAddresses(ticker: string): Promise<import('./users').GetDepositAddressesResp>;
}
