declare const _exports: ZaboSDK;
export = _exports;
/**
 * SDK main class definition
 */
declare class ZaboSDK {
    status: string;
    api: API;
    autoConnect: boolean;
    /**
     * Initialize the Zabo SDK.
     * @param {Object} o Zabo initialization config.
     * @returns The Zabo SDK.
     */
    init(o: any): Promise<any>;
    env: string | void;
    /**
     * Throw an error for the SDK.
     * @param {Number} code A status code relating to the error.
     * @param {String} message A message detailing the error.
     */
    throwConnectError(code: number, message: string): void;
    /**
     * Set up the API endpoints.
     */
    setEndpointAliases(): Promise<void>;
    /**
     * Checks if the environment is a valid environment.
     * @param {String} env The environment to use.
     * @returns The environment used, lowercased.
     */
    checkZaboEnv(env: string): string | void;
    /**
     * Connect the SDK to the Zabo API.
     * @param {{
     * provider?: string,
     * [key: string]: any
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
    getTeam(): Promise<any>;
    get data(): any;
}
import API = require("./api");
