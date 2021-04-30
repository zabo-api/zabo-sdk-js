export = API;
/**
 * Main API class definition
 */
declare class API {
    constructor(options: any);
    baseUrl: any;
    axios: any;
    resources: any;
    connectUrl: any;
    _onConnectorMessage: any;
    _onSocketMessage: any;
    _isConnecting: boolean;
    _isWaitingForConnector: boolean;
    /**
     * Connect to the Zabo API.
     * @param {{
     * provider?: string
     * }} param0 Connection config.
     * @returns An `appId` on servers.
     */
    connect({ provider }?: {
        provider?: string;
    }): Promise<any>;
    iframe: HTMLElement;
    connector: Window;
    /**
     *
     * @param {String} method HTTP method to use for the request.
     * @param {String} path The endpoint for the API.
     * @param {Object} data Additional data to send for the request.
     * @param {Boolean} isPublic If the endpoint requires authentication.
     * @returns
     */
    request(method: string, path: string, data: any, isPublic?: boolean): Promise<any>;
    _buildRequest(method: any, path: any, data: any, isPublic: any): {
        method: any;
        url: any;
        data: any;
        headers: {};
    };
    _watchConnector(teamSession: any): void;
    _setListeners(teamSession: any): void;
    ws: WebSocket;
    _removeListeners(): void;
    _onMessage(emitter: any, { origin, data }: {
        origin: any;
        data: any;
    }): void;
    _setAccountSession(cookie: any): boolean;
    _appendIframe(name: any): HTMLElement;
    _closeConnector(): void;
    _triggerCallback(type: any, data: any): void;
}
