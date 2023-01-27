import {
  Args_asyncBatchFetch,
  Args_batchFetch,
  Concurrent_Module,
  Concurrent_ReturnWhen,
  Concurrent_Task,
  FetchResult,
  Http_Module,
  Http_Response,
  Http_ResponseType,
} from "./wrap";
import {
  serializegetArgs,
  deserializegetResult,
} from "./wrap/imported/Http_Module/serialization";

export function asyncBatchFetch(args: Args_asyncBatchFetch): FetchResult[] {
  const tasks: Concurrent_Task[] = [];
  for (let i = 0; i < args.delays.length; i++) {
    const params = new Map<string, string>().set("seconds", args.delays[i]);
    const apiCall: ArrayBuffer = serializegetArgs({
      url: "https://hub.dummyapis.com/delay",
      request: {
        headers: null,
        urlParams: params,
        body: "",
        responseType: Http_ResponseType.TEXT,
      },
    });

    const task: Concurrent_Task = {
      uri: "ens/wrappers.polywrap.eth:http@1.1.0",
      method: "get",
      args: apiCall,
    };
    tasks.push(task);
  }
  const taskIds: Array<i32> = Concurrent_Module.schedule({
    tasks: tasks,
  }).unwrap();

  const results = Concurrent_Module.result({
    taskIds: taskIds,
    returnWhen: Concurrent_ReturnWhen.ALL_COMPLETED,
  }).unwrap();

  const parsedResults: Array<FetchResult> = [];

  for (let i = 0; i < results.length; i++) {
    if (results[i].result) {
      const parsed = deserializegetResult(results[i].result as ArrayBuffer);
      parsedResults.push({
        taskId: results[i].taskId,
        result: results[i].result,
        error: results[i].error,
        status: results[i].status,
        parsed: parsed,
      });
    } else {
      parsedResults.push({
        taskId: results[i].taskId,
        result: results[i].result,
        error: results[i].error,
        status: results[i].status,
        parsed: null,
      });
    }
  }

  return parsedResults;
}

export function batchFetch(args: Args_batchFetch): Http_Response[] {
  const results: Http_Response[] = [];
  for (let i = 0; i < args.delays.length; i++) {
    const param = new Map<string, string>().set("seconds", args.delays[i]);
    const apiResult = Http_Module.get({
      url: "https://hub.dummyapis.com/delay",
      request: {
        headers: null,
        urlParams: param,
        body: "",
        responseType: Http_ResponseType.TEXT,
      },
    }).unwrap() as Http_Response;

    results.push(apiResult);
  }
  return results;
}
