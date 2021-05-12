declare const _exports: (api: any) => ProvidersAPI;
export = _exports;
export type GetListProvidersResp = {
    data?: [import('./users').Provider];
    request_id?: string;
};
export type GetOneProviderResp = {
    request_id?: string;
} & import('./users').Provider;
export type ProvidersAPI = Providers;
/**
 * @typedef {{
 *  data?: [import('./users').Provider]
 *  request_id?: String
 * }} GetListProvidersResp
 *
 * @typedef {{
 *  request_id?: String
 * } & import('./users').Provider} GetOneProviderResp
 */
/**
 * Providers API.
 */
declare class Providers {
    constructor(api: any);
    /** @private */
    private api;
    /**
     * This endpoint will return the list of all providers available for an application as
     * well as the scopes and currencies available for that particular provider.
     * @param {{
     *  limit?: Number
     *  cursor?: String
     * }} param0 Request parameters.
     * @returns {Promise<GetListProvidersResp>} API response.
     */
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<GetListProvidersResp>;
    /**
     * This endpoint will return the requested provider resource.
     * **Note:** The provider name is the all lowercase 'computer' name for the provider, not the display name.
     * @param {String} name Name of the provider.
     * @returns {Promise<GetOneProviderResp>} API response.
     */
    getOne(name: string): Promise<GetOneProviderResp>;
}
