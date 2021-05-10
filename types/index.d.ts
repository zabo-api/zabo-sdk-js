declare const _exports: ZaboClass;
export = _exports;
export type ZaboClass = Zabo;
export type SDK = sdk.SDK
/**
 * Zabo main class definition.
 */
declare class Zabo {
    /**
     * Initialize the Zabo SDK.
     * @param {{
     *  clientId?: String
     *  env: 'live' | 'sandbox'
     *  apiKey?: String
     *  secretKey?: String
     *  autoConnect?: Boolean
     *  apiVersion?: 'v0' | 'v1' | {}
     *  [key: String]?: any?
     * }} config Zabo initialization config.
     * @returns {Promise<sdk.SDK>} The Zabo SDK.
     */
    init(config?: {
        clientId?: string;
        env: 'live' | 'sandbox';
        apiKey?: string;
        secretKey?: string;
        autoConnect?: boolean;
        apiVersion?: 'v0' | 'v1' | {};
        any?: any;
    }): Promise<sdk.SDK>;
    /**
     * Get an instance of the ZaboSDK.
     * @returns {sdk.SDK} An instance of ZaboSDK.
     */
    get instance(): any;
    get version(): any;
}
import sdk = require('./sdk')