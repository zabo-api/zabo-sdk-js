build-proto:
	protoc --proto_path=../standard-data-structures/proto/finance --proto_path=../zabo-software/proto --js_out=import_style=commonjs:src/proto_out --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/proto_out service.proto finance.proto
	python -m grpc_tools.protoc --proto_path=../standard-data-structures/proto/finance --proto_path=../zabo-software/proto --python_out=src/proto_out --grpc_python_out=src/proto_out service.proto finance.proto
	python -m grpc_tools.protoc -I../../protos --python_out=. --grpc_python_out=. ../../protos/route_guide.proto