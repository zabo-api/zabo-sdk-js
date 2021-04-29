declare function _exports(api: any): Providers;
export = _exports;
declare class Providers {
    constructor(api: any);
    api: any;
    getList({ limit, cursor }?: {
        limit?: number;
        cursor?: string;
    }): Promise<any>;
    getOne(name: any): Promise<any>;
}
