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
proto.GreeterClient =
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
proto.GreeterPromiseClient =
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
 *   !proto.GetBalancesRequest,
 *   !proto.GetBalancesResponse>}
 */
const methodDescriptor_Greeter_GetBalances = new grpc.web.MethodDescriptor(
  '/Greeter/GetBalances',
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
const methodInfo_Greeter_GetBalances = new grpc.web.AbstractClientBase.MethodInfo(
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
proto.GreeterClient.prototype.getBalances =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Greeter/GetBalances',
      request,
      metadata || {},
      methodDescriptor_Greeter_GetBalances,
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
proto.GreeterPromiseClient.prototype.getBalances =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Greeter/GetBalances',
      request,
      metadata || {},
      methodDescriptor_Greeter_GetBalances);
};


module.exports = proto;

