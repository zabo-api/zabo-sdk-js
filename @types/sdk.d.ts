declare const _exports: ZaboSDK;
export = _exports;
/**
 * SDK main class definition.
 */
declare class ZaboSDK {
    status: string;
    /** @private */
    private api;
    autoConnect: boolean;
    /**
     * Account functions.
     * @type {import('./resources/accounts').AccountsAPI}
     */
    accounts: import('./resources/accounts').AccountsAPI;
    /**
     * Blockchain functions.
     * @type {import('./resources/blockchains').BlockchainsAPI}
     */
    blockchains: import('./resources/blockchains').BlockchainsAPI;
    /**
     * Currency functions.
     * @type {import('./resources/currencies').CurrenciesAPI}
     */
    currencies: import('./resources/currencies').CurrenciesAPI;
    /**
     * Provider functions.
     * @type {import('./resources/providers').ProvidersAPI}
     */
    providers: import('./resources/providers').ProvidersAPI;
    /**
     * Trading functions. Client-side only.
     * @type {import('./resources/trading').TradingAPI}
     */
    trading: import('./resources/trading').TradingAPI;
    /**
     * Transaction functions.
     * @type {import('./resources/transactions').TransactionsAPI}
     */
    transactions: import('./resources/transactions').TransactionsAPI;
    /**
     * User functions.
     * @type {import('./resources/users').UsersAPI}
     */
    users: import('./resources/users').UsersAPI;
    init(o: any): Promise<any>;
    env: string | void;
    apiVersion: any;
    /**
     * Throw an error for the SDK.
     * @param {Number} code A status code relating to the error.
     * @param {String} message A message detailing the error.
     */
    throwConnectError(code: number, message: string): void;
    /**
     * Set up the API endpoints on the SDK.
     */
    setEndpointAliases(): Promise<void>;
    /**
     * Checks if the environment is a valid environment.
     * @param {String} env The environment to use.
     * @returns The environment used, lowercased.
     */
    checkZaboEnv(env: string): string | void;
    checkApiVersion(version: any): any;
    /**
     * Connect the SDK to the Zabo API.
     * @param {{
     *  provider?: string,
     *  [key: string]: any
     * }} config Zabo API connection config.
     * @returns A connected SDK object for browsers, an appId for servers.
     */
    connect(config?: {
        [key: string]: any;
        provider?: string;
    }): Promise<any> | ZaboSDK;
    /**
     * Callback function for when a new connection is made to the API.
     * @param {Function} fn The function to run on connections.
     * @returns An instance of the SDK.
     */
    onConnection(fn: Function): ZaboSDK;
    /**
     * Callback function for when an error occurs.
     * @param {Function} fn The function to run on errors.
     * @returns An instance of the SDK.
     */
    onError(fn: Function): ZaboSDK;
    /**
     * Callback function for when events are triggered.
     * @param {Function} fn The function to run on events.
     * @returns An instance of the SDK.
     */
    onEvent(fn: Function): ZaboSDK;
    /**
     * This function will return your team resource. You must have access rights to the team.
     * @returns {Promise<any>} Your team.
     */
    getTeam(): Promise<any>;
    get data(): any;
}
