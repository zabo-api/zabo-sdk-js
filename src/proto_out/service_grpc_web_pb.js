/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var finance_pb = require('./finance_pb.js')
const proto = require('./service_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ZaboClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ZaboPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Empty,
 *   !proto.GetProvidersResponse>}
 */
const methodDescriptor_Zabo_GetProviders = new grpc.web.MethodDescriptor(
  '/Zabo/GetProviders',
  grpc.web.MethodType.UNARY,
  proto.Empty,
  proto.GetProvidersResponse,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetProvidersResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.Empty,
 *   !proto.GetProvidersResponse>}
 */
const methodInfo_Zabo_GetProviders = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetProvidersResponse,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetProvidersResponse.deserializeBinary
);


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetProvidersResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetProvidersResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ZaboClient.prototype.getProviders =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Zabo/GetProviders',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetProviders,
      callback);
};


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetProvidersResponse>}
 *     Promise that resolves to the response
 */
proto.ZaboPromiseClient.prototype.getProviders =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Zabo/GetProviders',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetProviders);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RegisterProviderRequest,
 *   !proto.RegisterProviderResponse>}
 */
const methodDescriptor_Zabo_RegisterProvider = new grpc.web.MethodDescriptor(
  '/Zabo/RegisterProvider',
  grpc.web.MethodType.UNARY,
  proto.RegisterProviderRequest,
  proto.RegisterProviderResponse,
  /**
   * @param {!proto.RegisterProviderRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RegisterProviderResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.RegisterProviderRequest,
 *   !proto.RegisterProviderResponse>}
 */
const methodInfo_Zabo_RegisterProvider = new grpc.web.AbstractClientBase.MethodInfo(
  proto.RegisterProviderResponse,
  /**
   * @param {!proto.RegisterProviderRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RegisterProviderResponse.deserializeBinary
);


/**
 * @param {!proto.RegisterProviderRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.RegisterProviderResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.RegisterProviderResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ZaboClient.prototype.registerProvider =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Zabo/RegisterProvider',
      request,
      metadata || {},
      methodDescriptor_Zabo_RegisterProvider,
      callback);
};


/**
 * @param {!proto.RegisterProviderRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.RegisterProviderResponse>}
 *     Promise that resolves to the response
 */
proto.ZaboPromiseClient.prototype.registerProvider =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Zabo/RegisterProvider',
      request,
      metadata || {},
      methodDescriptor_Zabo_RegisterProvider);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GetBalancesRequest,
 *   !proto.GetBalancesResponse>}
 */
const methodDescriptor_Zabo_GetBalances = new grpc.web.MethodDescriptor(
  '/Zabo/GetBalances',
  grpc.web.MethodType.UNARY,
  proto.GetBalancesRequest,
  proto.GetBalancesResponse,
  /**
   * @param {!proto.GetBalancesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetBalancesResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GetBalancesRequest,
 *   !proto.GetBalancesResponse>}
 */
const methodInfo_Zabo_GetBalances = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetBalancesResponse,
  /**
   * @param {!proto.GetBalancesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetBalancesResponse.deserializeBinary
);


/**
 * @param {!proto.GetBalancesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetBalancesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetBalancesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ZaboClient.prototype.getBalances =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Zabo/GetBalances',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetBalances,
      callback);
};


/**
 * @param {!proto.GetBalancesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetBalancesResponse>}
 *     Promise that resolves to the response
 */
proto.ZaboPromiseClient.prototype.getBalances =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Zabo/GetBalances',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetBalances);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GetTransactionsRequest,
 *   !proto.GetTransactionsResponse>}
 */
const methodDescriptor_Zabo_GetTransactions = new grpc.web.MethodDescriptor(
  '/Zabo/GetTransactions',
  grpc.web.MethodType.UNARY,
  proto.GetTransactionsRequest,
  proto.GetTransactionsResponse,
  /**
   * @param {!proto.GetTransactionsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetTransactionsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GetTransactionsRequest,
 *   !proto.GetTransactionsResponse>}
 */
const methodInfo_Zabo_GetTransactions = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetTransactionsResponse,
  /**
   * @param {!proto.GetTransactionsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetTransactionsResponse.deserializeBinary
);


/**
 * @param {!proto.GetTransactionsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetTransactionsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetTransactionsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ZaboClient.prototype.getTransactions =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Zabo/GetTransactions',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetTransactions,
      callback);
};


/**
 * @param {!proto.GetTransactionsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetTransactionsResponse>}
 *     Promise that resolves to the response
 */
proto.ZaboPromiseClient.prototype.getTransactions =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Zabo/GetTransactions',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetTransactions);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GetSessionRequest,
 *   !proto.GetSessionResponse>}
 */
const methodDescriptor_Zabo_GetSession = new grpc.web.MethodDescriptor(
  '/Zabo/GetSession',
  grpc.web.MethodType.UNARY,
  proto.GetSessionRequest,
  proto.GetSessionResponse,
  /**
   * @param {!proto.GetSessionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetSessionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GetSessionRequest,
 *   !proto.GetSessionResponse>}
 */
const methodInfo_Zabo_GetSession = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetSessionResponse,
  /**
   * @param {!proto.GetSessionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetSessionResponse.deserializeBinary
);


/**
 * @param {!proto.GetSessionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetSessionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetSessionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ZaboClient.prototype.getSession =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Zabo/GetSession',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetSession,
      callback);
};


/**
 * @param {!proto.GetSessionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetSessionResponse>}
 *     Promise that resolves to the response
 */
proto.ZaboPromiseClient.prototype.getSession =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Zabo/GetSession',
      request,
      metadata || {},
      methodDescriptor_Zabo_GetSession);
};


module.exports = proto;

