declare const _exports: (api: any) => UsersAPI;
export = _exports;
export type Application = {
    id?: string;
    name?: string;
};
export type Provider = {
    name?: string;
    display_name?: string;
    logo?: string;
    auth_type?: string;
    available_currencies?: [
        {
            type?: string;
            list?: [string];
            resource_type?: string;
        }
    ];
    type?: string;
    scopes?: [string];
    resource_type?: string;
};
export type Account = {
    id?: string;
    blockchain?: string;
    provider?: Provider;
    last_connected?: number;
    created_at?: number;
    updated_at?: number;
    resource_type?: string;
    balances?: [Balance];
};
export type User = {
    id?: string;
    accounts?: [Account];
    created_at?: number;
    updated_at?: number;
    resource_type?: string;
    request_id?: string;
};
export type CreateUserResp = User;
export type AddAccountResp = {
    id?: string;
    application?: Application;
    accounts?: [Account];
    created_at?: number;
    updated_at?: number;
    resource_type?: string;
    request_id?: string;
};
export type RemoveAccountResp = AddAccountResp;
export type GetOneUserResp = User;
export type GetListUsersResp = [User];
export type Balance = {
    ticker?: string;
    provider_ticker?: string;
    name?: string;
    asset_is_verified?: boolean;
    asset_type?: string;
    amount?: string;
    decimals?: number;
    fiat_ticker?: string;
    fiat_value?: string;
    fiat_asset_is_verified?: boolean;
    logo?: string;
    updated_at?: number;
    misc?: any;
    resource_type?: string;
};
export type GetAccountResp = {
    balances?: [Balance];
} & Account;
export type GetBalancesResp = [Balance];
export type CreateDepositAddressResp = {
    currency?: import('./currencies').Currency;
    provider_ticker?: string;
    address?: string;
    request_id?: string;
};
export type GetDepositAddressesResp = [
    {
        ticker?: string;
        provider_ticker?: string;
        address?: string;
        resource_type?: string;
    }
];
export type UsersAPI = Users;
/**
 * @typedef {{
 *  id?: String,
 *  name?: String
 * }} Application
 *
 * @typedef {{
 *  name?: String
 *  display_name?: String
 *  logo?: String
 *  auth_type?: String
 *  available_currencies?: [{
 *    type?: String
 *    list?: [String]
 *    resource_type?: String
 *  }]
 *  type?: String
 *  scopes?: [String]
 *  resource_type?: String
 * }} Provider
 *
 * @typedef {{
 *  id?: String
 *  blockchain?: String
 *  provider?: Provider
 *  last_connected?: Number
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  balances?: [Balance]
 * }} Account
 *
 * @typedef {{
 *  id?: String,
 *  accounts?: [Account]
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  request_id?: String
 * }} User
 *
 * @typedef {User} CreateUserResp
 *
 * @typedef {{
 *  id?: String
 *  application?: Application
 *  accounts?: [Account]
 *  created_at?: Number
 *  updated_at?: Number
 *  resource_type?: String
 *  request_id?: String
 * }} AddAccountResp
 *
 * @typedef {AddAccountResp} RemoveAccountResp
 *
 * @typedef {User} GetOneUserResp
 *
 * @typedef {[User]} GetListUsersResp
 *
 * @typedef {{
 *  ticker?: String
 *  provider_ticker?: String
 *  name?: String
 *  asset_is_verified?: Boolean
 *  asset_type?: String
 *  amount?: String
 *  decimals?: Number
 *  fiat_ticker?: String
 *  fiat_value?: String
 *  fiat_asset_is_verified?: Boolean
 *  logo?: String
 *  updated_at?: Number
 *  misc?: any
 *  resource_type?: String
 * }} Balance
 *
 * @typedef {{
 *  balances?: [Balance]
 * } & Account} GetAccountResp
 *
 * @typedef {[Balance]} GetBalancesResp
 *
 * @typedef {{
 *  currency?: import('./currencies').Currency
 *  provider_ticker?: String
 *  address?: String
 *  request_id?: String
 * }} CreateDepositAddressResp
 *
 * @typedef {[{
 *  ticker?: String
 *  provider_ticker?: String
 *  address?: String
 *  resource_type?: String
 * }]} GetDepositAddressesResp
 */
declare class Users {
    constructor(api: any);
    api: any;
    /**
     * This function creates a new user for your application. A user connects their cryptocurrency
     * wallet via the Zabo Client API, and then you can create a user from your server.
     * From there, your application server can have access this user's account data.
     * @param {any} account Account data.
     * @returns {Promise<CreateUserResp>} API response.
     */
    create(account?: any): Promise<CreateUserResp>;
    /**
     * This function inserts an additional account into a given user object.
     * Useful when your application makes it possible for the same user to connect with multiple providers.
     * @param {any} user The user object received from zabo.users.create() response.
     * @param {any} account The account object received when the user connected. This object must contain a valid token.
     * @returns {Promise<AddAccountResp>} API response.
     */
    addAccount(user?: any, account?: any): Promise<AddAccountResp>;
    /**
     * This function removes a defined account from a given user object. Use this function when a user
     * doesn't want to have any specific provider account linked to your application anymore.
     * @param {{ userId: String, accountId: String }} param0 The user & account IDs.
     * @returns {Promise<RemoveAccountResp>} API response.
     */
    removeAccount({ userId, accountId }: {
        userId: string;
        accountId: string;
    }): Promise<RemoveAccountResp>;
    /**
     * This function returns the user requested. The user object contains the user's unique id
     * and accounts information, including the provider used during connection with your app.
     * @param {String} id The user's ID.
     * @returns {Promise<GetOneUserResp>} API response.
     */
    getOne(id: string): Promise<GetOneUserResp>;
    /**
     * This function returns all users registered with the application. You must have authorization to the users.
     * @param {{ limit?: Number, cursor?: String }} param0 Cursor location.
     * @returns {Promise<GetListUsersResp>} API response.
     */
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<GetListUsersResp>;
    /**
     * This function returns the full account object for a particular user requested.
     * @param {{ userId: String, accountId: String }} param0 The user & account IDs.
     * @returns {Promise<GetAccountResp>} API response.
     */
    getAccount({ userId, accountId }?: {
        userId: string;
        accountId: string;
    }): Promise<GetAccountResp>;
    /**
     * Returns the user balances for the requested currencies. When requesting balances from the client,
     * the request should be made in the context of the connected account. When requesting from an application server,
     * requests should be made in the context of a user. Cryptocurrencies available to your app can be queried
     * using the currencies function documented below. If no currencies are specified, then all
     * available currencies will be returned.
     * @param {{
     *  userId?: String
     *  accountId?: String
     *  tickers?: String
     * }} param0 Request parameters.
     * @returns {Promise<GetBalancesResp>} API response.
     */
    getBalances({ userId, accountId, tickers }?: {
        userId?: string;
        accountId?: string;
        tickers?: string;
    }): Promise<GetBalancesResp>;
    /**
     * This endpoint will create and return a deposit address for the specified account. If the currency
     * is not supported by the connected provider, you will receive an 'unsupported' error.
     * @param {{
     *  userId?: String
     *  accountId?: String
     *  ticker?: String
     * }} param0 Request parameters.
     * @returns {Promise<CreateDepositAddressResp>} API response.
     */
    createDepositAddress({ userId, accountId, ticker }?: {
        userId?: string;
        accountId?: string;
        ticker?: string;
    }): Promise<CreateDepositAddressResp>;
    /**
     * This endpoint will retrieve all deposit addresses for the specified account. If the currency
     * is not supported by the connected provider, you will receive an 'unsupported' error.
     * @param {{
     *  userId?: String
     *  accountId?: String
     *  ticker?: String
     * }} param0 Request parameters.
     * @returns {Promise<GetDepositAddressesResp>} API response.
     */
    getDepositAddresses({ userId, accountId, ticker }?: {
        userId?: string;
        accountId?: string;
        ticker?: string;
    }): Promise<GetDepositAddressesResp>;
}
