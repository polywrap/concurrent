import { CoreClient, InvokeResult, Uri } from "@polywrap/core-js";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";
import { msgpackEncode } from "@polywrap/msgpack-js"
import {
  Args_abort,
  Args_result,
  Args_schedule,
  Args_status,
  Int,
  Concurrent_ReturnWhenEnum,
  Concurrent_Task,
  Concurrent_TaskResult,
  Concurrent_TaskStatus,
  Concurrent_TaskStatusEnum,
  manifest,
  Module,
} from "./wrap";

type NoConfig = Record<string, never>;

export class ConcurrentPromisePlugin extends Module<NoConfig> {
  private _totalTasks = 0;
  private _tasks: Record<number, Promise<InvokeResult>> = {};
  private _status: Record<number, Concurrent_TaskStatus> = {};

  public async result(
    input: Args_result,
    client: CoreClient
  ): Promise<Array<Concurrent_TaskResult>> {
    switch (input.returnWhen) {
      case Concurrent_ReturnWhenEnum.FIRST_COMPLETED: {
        const result = await Promise.race(
          input.taskIds.map((id) => this.resolveTask(id))
        );
        return [result];
      }
      case Concurrent_ReturnWhenEnum.ALL_COMPLETED: {
        return await Promise.all(
          input.taskIds.map((id) => this.resolveTask(id))
        );
      }
      case Concurrent_ReturnWhenEnum.ANY_COMPLETED: {
        const result = await Promise.any(
          input.taskIds.map((id) => this.resolveTask(id)
            .then((result) => {
              if (result.error) {
                return Promise.reject(result.error);
              }
              return result;
            })
          )
        ).catch((err: AggregateError) => input.taskIds.map((id, idx) => ({
            taskId: id,
            result: undefined,
            error: err.errors[idx],
            status: Concurrent_TaskStatusEnum.FAILED,
          }))
        );
        return Array.isArray(result) ? result : [result];
      }
      default:
        throw new Error("Invalid value of ReturnWhen enum: " + input.returnWhen);
    }
  }

  public async status(
    input: Args_status,
    client: CoreClient
  ): Promise<Array<Concurrent_TaskStatus>> {
    return input.taskIds.map((id) => this._status[id]);
  }

  public schedule(input: Args_schedule, client: CoreClient): Array<Int> {
    return input.tasks.map((task) => {
      return this.scheduleTask(
        {
          ...task,
        },
        client
      );
    });
  }

  public abort(args: Args_abort, client: CoreClient): Array<boolean> {
    return args.taskIds.map(_id => false);
  }

  private scheduleTask(task: Concurrent_Task, client: CoreClient): number {
    this._tasks[this._totalTasks] = client.invoke({
      uri: Uri.from(task.uri),
      method: task.method,
      args: task.args,
    });
    this._status[this._totalTasks] = Concurrent_TaskStatusEnum.RUNNING;
    return this._totalTasks++;
  }

  private resolveTask(taskId: number): Promise<Concurrent_TaskResult> {
    return this._tasks[taskId]
      .then((result: InvokeResult) => {
        this._status[taskId] = Concurrent_TaskStatusEnum.COMPLETED;
        if (!result.ok) {
          return {
            taskId,
            result: undefined,
            error: result.error?.message ?? `Unknown error occurred in concurrent task ${taskId}`,
            status: Concurrent_TaskStatusEnum.FAILED,
          };
        }
        return {
          taskId: taskId,
          result: new Uint8Array(msgpackEncode(result.value)),
          error: undefined,
          status: Concurrent_TaskStatusEnum.COMPLETED,
        };
      })
      .catch((err) => {
        this._status[taskId] = Concurrent_TaskStatusEnum.FAILED;
        return {
          taskId: taskId,
          result: undefined,
          error: err.message ?? `Unknown error occurred in concurrent task ${taskId}`,
          status: Concurrent_TaskStatusEnum.FAILED,
        };
      });
  }
}

export const concurrentPromisePlugin: PluginFactory<NoConfig> = () =>
  new PluginPackage(new ConcurrentPromisePlugin({}), manifest);

export const plugin = concurrentPromisePlugin;
