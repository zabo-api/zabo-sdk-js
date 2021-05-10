declare const _exports: ZaboClass;
export = _exports;
export type ZaboClass = Zabo;
export type SDK = typeof import('./sdk');
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
     * }} config Zabo initialization config.
     * @returns {Promise<SDK>} The Zabo SDK.
     */
    init(config?: {
        clientId?: string;
        env: 'live' | 'sandbox';
        apiKey?: string;
        secretKey?: string;
        autoConnect?: boolean;
        apiVersion?: 'v0' | 'v1' | {};
    }): Promise<SDK>;
    /**
     * Get an instance of the ZaboSDK.
     * @returns {SDK} An instance of ZaboSDK.
     */
    get instance(): SDK;
    get version(): any;
}
