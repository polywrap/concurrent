# @polywrap/concurrent-plugin-js

The Concurrent plugin enables wraps running within the Polywrap client to run multiple invocations in parallel. This implementation utilizes JavaScript Promises for concurrent tasks.

## Interface

The Concurrent plugin implements an existing wrap interface at `wrapscan.io/polywrap/concurrent@1.0`.

## Usage

Add the concurrent plugin to the Polywrap client's configuration:
```typescript
import { PolywrapClient, ClientConfigBuilder } from "@polywrap/client-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";

const config = new ClientConfigBuilder()
  .addPackage(
    "wrapscan.io/polywrap/concurrent@1.0",
    concurrentPromisePlugin({ })
  )
  .build();

const client = new PolywrapClient();
```

Now wraps that depend upon the concurrent interface will be using the "concurrent promise plugin" implementation.

For more usage examples see `src/__tests__`.
