import {ClientConfigBuilder, defaultPackages, PolywrapClient} from "@polywrap/client-js";
import { concurrentPromisePlugin } from "../index";
import { httpPlugin } from "@polywrap/http-plugin-js";

jest.setTimeout(300000);

describe("e2e", () => {
  let client: PolywrapClient;
  let fsUri: string;

  beforeAll(async () => {
    const config = new ClientConfigBuilder()
      .addDefaults()
      .removePackage(defaultPackages.concurrent)
      .addPackage({
        uri: "ens/wrappers.polywrap.eth:http@1.1.0",
        package: httpPlugin({})
        })
      .addPackage({
        uri: "ens/wrappers.polywrap.eth:concurrent@1.0.0",
        package: concurrentPromisePlugin({}),
      })
      .build()
    client = new PolywrapClient(config);
    fsUri = `fs/${__dirname}/integration/build`;
  });

  test("asyncBatchFetch", async () => {
    const result = await client.invoke({
      uri: fsUri,
      method: "asyncBatchFetch",
      args: { delays: ["1", "2", "3"] },
    });
    if (!result.ok) fail(result.error);
    expect(result.value).toHaveLength(3);
  });

  test("batchFetch", async () => {
    const result = await client.invoke({
      uri: fsUri,
      method: "batchFetch",
      args: { delays: ["1", "2", "3"] },
    });
    if (!result.ok) fail(result.error);
    expect(result.value).toHaveLength(3);
  });
});
