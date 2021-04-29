declare function _exports(api: any, appId: any): Teams;
export = _exports;
declare class Teams {
    constructor(api: any);
    api: any;
    id: any;
    data: any;
    setId(id: any): void;
    get(): Promise<any>;
    getSession(): Promise<any>;
}
