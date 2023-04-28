import { ClientConfigBuilder, PolywrapClient, DefaultBundle } from "@polywrap/client-js";
import { concurrentPromisePlugin } from "../index";
import { Commands } from "@polywrap/cli-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

jest.setTimeout(300000);

describe("e2e", () => {
  let client: PolywrapClient;
  let fsUri: string;
  const concurrentUri = DefaultBundle.plugins.concurrent.uri.uri;

  beforeAll(async () => {
    const wrapperPath = `${__dirname}/integration`;
    const { exitCode, stdout, stderr } = await Commands.build(
      undefined, {
        cwd: wrapperPath,
        env: process.env as Record<string, string>
      }
    );

    if (exitCode !== 0) {
      throw new Error(stdout + stderr);
    }

    fsUri = `fs/${wrapperPath}/build`;

    const config = new ClientConfigBuilder()
      .addDefaults()
      .removePackage(concurrentUri)
      .addPackage("ens/wraps.eth:http@1.1.0", httpPlugin({}))
      .addPackage(concurrentUri, concurrentPromisePlugin({}))
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
