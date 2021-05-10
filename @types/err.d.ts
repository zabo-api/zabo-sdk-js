export class SDKError extends Error {
    constructor(type: any, msg: any, requestId: any, ...params: any[]);
    error_type: any;
    request_id: any;
}
