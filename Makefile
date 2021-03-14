build-proto:
	protoc --proto_path=../standard-data-structures/proto/finance --proto_path=../zabo-software/proto --js_out=import_style=commonjs:src/proto_out --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/proto_out service.proto finance.proto
