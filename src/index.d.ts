declare const _exports: ZaboClass;
export = _exports
export type ZaboClass = Zabo;
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
     * @returns {typeof Promise<import('../dist/@types/sdk')>} The Zabo SDK.
     */
    init(config?: {
        clientId?: string;
        env: 'live' | 'sandbox';
        apiKey?: string;
        secretKey?: string;
        autoConnect?: boolean;
        apiVersion?: 'v0' | 'v1' | {};
    }): Promise<typeof import('../dist/@types/sdk')>;
    /**
     * Get an instance of the ZaboSDK.
     * @returns {typeof import('../dist/@types/sdk')} An instance of ZaboSDK.
     */
    get instance(): typeof import('../dist/@types/sdk');
    get version(): any;
}
