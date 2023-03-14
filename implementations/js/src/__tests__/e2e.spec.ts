import { PolywrapClient } from "@polywrap/client-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { concurrentPromisePlugin } from "../index";

jest.setTimeout(300000);

describe("e2e", () => {
  let client: PolywrapClient;
  let fsUri: string;

  beforeAll(async () => {
    const config = new ClientConfigBuilder()
      .addDefaults()
      .addUriRedirect("wrap://ens/wraps.eth:http@1.1.0", "wrap://ens/http.polywrap.eth")
      .addPlugin(
        "wrap://ens/wraps.eth:concurrent@1.0.0",
        concurrentPromisePlugin({})
      )
      .build();
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
