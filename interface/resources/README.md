# Concurrent Wrapper Interface

| Version | URI | WRAP Version |
|-|-|-|
| 1.0.0 | [`wrap://ens/wraps.eth:concurrent@1.0.0`](https://wrappers.io/v/ens/wraps.eth:concurrent@1.0.0) | 0.1 |

## Description

The concurrent interface provides a common concurrency interface that can be shared across various concurrency implementations, like Threads, Processes and even language specific primitives like JavaScript Promises.

## Interface
```graphql
enum TaskStatus {
  PENDING  # applicable when running in pool
  RUNNING
  COMPLETED
  CANCELLED  # applicable when threads/processes are used
  FAILED
}

enum ReturnWhen {
  FIRST_COMPLETED,  # return the first task that completes or fails
  ANY_COMPLETED,  # return any task that completes or returns array of all the errors
  ALL_COMPLETED,  # return result of all the tasks or failures
}

type Task {
  uri: String!
  method: String!
  args: Bytes!
}

type TaskResult {
  taskId: Int!
  result: Bytes
  error: String
  status: TaskStatus!
}

type Env {
  max_workers: Int
}

type Module {
  result(taskIds: [Int!]!, returnWhen: ReturnWhen!): [TaskResult!]!
  status(taskIds: [Int!]!): [TaskStatus!]!
  schedule(tasks: [Task!]!): [Int!]! # returns taskIds
  abort(taskIds: [String!]!): [Boolean!]!
}
```

## Usage
```graphql
#import * from "ens/wraps.eth:concurrent@1.0.0"
```

And implement the interface methods within your programming language of choice.

## Source Code
[Link](https://github.com/polywrap/concurrent)

## Known Implementations
[Link](https://github.com/polywrap/concurrent/tree/main/implementations)
