#!/bin/bash

# Get the root directory of the project
ROOT_DIR=$(git rev-parse --show-toplevel)

PLUGIN_PATH="$ROOT_DIR/node_modules/.bin/protoc-gen-ts_proto"

# Set the base directory for proto files
PROTO_DIR="$ROOT_DIR/server/proto"

# Set the output directory for generated files
OUT_DIR="$PROTO_DIR/generated"

# Run the protoc command
protoc -I=$PROTO_DIR \
  --plugin=$PLUGIN_PATH \
  --ts_proto_out=$OUT_DIR \
  $PROTO_DIR/*.proto \
  --ts_proto_opt=esModuleInterop=true

echo "Protocol Buffers TypeScript files generated in $OUT_DIR"
