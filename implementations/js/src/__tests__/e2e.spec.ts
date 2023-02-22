import {ClientConfigBuilder, defaultInterfaces, PolywrapClient} from "@polywrap/client-js";
import { concurrentPromisePlugin } from "../index";
import {buildWrapper} from "@polywrap/test-env-js";
import { httpPlugin } from "temp-http-plugin-js";

jest.setTimeout(300000);

describe("e2e", () => {
  let client: PolywrapClient;
  let fsUri: string;

  beforeAll(async () => {
    const wrapperPath = `${__dirname}/integration`;
    await buildWrapper(wrapperPath);
    fsUri = `fs/${wrapperPath}/build`;

    const config = new ClientConfigBuilder()
      .addDefaults()
      .removePackage(defaultInterfaces.concurrent)
      .addPackage("ens/wraps.eth:http@1.1.0", httpPlugin({}))
      .addPackage("ens/wraps.eth:concurrent@1.0.0", concurrentPromisePlugin({}))
      .build();
    client = new PolywrapClient(config);
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
