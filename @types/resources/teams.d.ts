declare const _exports: (api: any) => TeamsAPI;
export = _exports;
export type TeamsAPI = Teams;
/**
 * Teams API.
 */
declare class Teams {
    constructor(api: any);
    api: any;
    id: any;
    data: any;
    setId(id: any): void;
    get(): Promise<any>;
    getSession(): Promise<any>;
}
