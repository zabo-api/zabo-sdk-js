declare const _exports: (api: any) => TransactionsAPI;
export = _exports;
export type Part = {
    direction?: 'sent' | 'received';
    ticker?: string;
    provider_ticker?: string;
    amount?: string;
    asset_is_verified?: boolean;
    fiat_ticker?: string;
    fiat_value?: string;
    fiat_asset_is_verified?: boolean;
    other_parties?: [string];
};
export type Fee = {
    type?: string;
    ticker?: string;
    provider_ticker?: string;
    amount?: string;
    asset_is_verified?: boolean;
    fiat_ticker?: string;
    fiat_value?: string;
    fiat_asset_is_verified?: boolean;
    resource_type?: string;
};
export type Transaction = {
    id?: string;
    status?: string;
    transaction_type?: string;
    parts?: [Part];
    fees?: [Fee];
    misc?: [any];
    fiat_calculated_at?: number;
    initiated_at?: number;
    confirmed_at?: number;
    resource_type?: string;
};
export type TransactionsResp = {
    data?: [Transaction];
    delay?: number;
    last_updated_at?: number;
    request_id?: string;
};
export type TransactionsAPI = Transactions;
/**
 * @typedef {{
 *  direction?: 'sent' | 'received'
 *  ticker?: String
 *  provider_ticker?: String
 *  amount?: String
 *  asset_is_verified?: Boolean
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  other_parties?: [String]
 * }} Part
 *
 * @typedef {{
 *  type?: String
 *  ticker?: String
 *  provider_ticker?: String
 *  amount?: String
 *  asset_is_verified?: Boolean
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  resource_type?: String
 * }} Fee
 *
 * @typedef {{
 *  id?: String
 *  status?: String
 *  transaction_type?: String
 *  parts?: [Part]
 *  fees?: [Fee]
 *  misc?: [any]
 *  fiat_calculated_at?: Number
 *  initiated_at?: Number
 *  confirmed_at?: Number
 *  resource_type?: String
 * }} Transaction
 *
 * @typedef {{
 *  data?: [Transaction]
 *  delay?: Number
 *  last_updated_at?: Number
 *  request_id?: String
 * }} TransactionsResp
 */
/**
 * Transactions API.
 */
declare class Transactions {
    constructor(api: any);
    api: any;
    account: any;
    /**
     * @private
     */
    private _setAccount;
    /**
     * getOne fetches a specific transaction for the given account.
     * @param {{
     *  userId: string,
     *  accountId?: string,
     *  txId: string,
     *  ticker: string,
     * }} param0 Transaction request object.
     * @returns {Promise<Transaction>} A transaction.
     */
    getOne({ userId, accountId, txId }?: {
        userId: string;
        accountId?: string;
        txId: string;
        ticker: string;
    }): Promise<Transaction>;
    /**
     * getList fetches a list of transaction for the given account.
     * @param {{
     *  userId: String,
     *  accountId?: String,
     *  ticker?: String,
     *  limit?: Number,
     *  cursor?: String
     * }} param0 Transactions request object.
     * @returns {Promise<TransactionsResp>} An API response with transactions within `data`.
     */
    getList({ userId, accountId, ticker, limit, cursor }?: {
        userId: string;
        accountId?: string;
        ticker?: string;
        limit?: number;
        cursor?: string;
    }): Promise<TransactionsResp>;
}
