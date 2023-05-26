# Datetime Wrapper Interface

| Version | URI | WRAP Version |
|-|-|-|
| 1.0.0 | [`wrap://ens/wraps.eth:concurrency@1.0.0`](https://wrappers.io/v/ens/wraps.eth:concurrency@1.0.0) | 0.1 |

## Interface
```graphql
enum TaskStatus {
    # Task is scheduled but not yet running. Applicable when running in pool
    PENDING
    # Task is executing
    RUNNING
    # Task is paused
    SUSPENDED
    # Task has completed execution
    COMPLETED
    # Task has been aborted. Applicable when threads/processes are used
    CANCELLED
    # Task failed to execute
    FAILED
}

enum ReturnWhen {
    # return the first task that completes or fails
    FIRST_COMPLETED
    # return any task that completes or returns array of all the errors
    ANY_COMPLETED
    # return result of all the tasks or failures
    ALL_COMPLETED
}

# Priority helps determine the order in which tasks will be run
enum Priority {
    LOW
    MEDIUM
    HIGH
}

type Task {
    # Wrap URI to invoke
    uri: String!
    # Method name
    method: String!
    # Invocation arguments, serialized in MessagePack format
    args: Bytes!
    # Priority helps determine the order in which tasks will be run. Defaults to Priority.MEDIUM.
    priority: Priority
    # Task will not run until dependent tasks have completed
    dependsOn: [Int!]
    # The maximum number of workers that should be used to execute this task
    max_workers: Int
}

type TaskResult {
    # Unique ID of task
    taskId: Int!
    # Invocation result, serialized in MessagePack format
    result: Bytes
    # Error message that is present if task failed, and null otherwise
    error: String
    # The current status of the task
    status: TaskStatus!
}

type Module {
    # Get the result of one or more scheduled tasks
    result(taskIds: [Int!]!, returnWhen: ReturnWhen!): [TaskResult!]!

    # Get the status of one or more scheduled tasks
    status(taskIds: [Int!]!): [TaskStatus!]!

    # Schedule one or more tasks; returns the Task ID of each scheduled task
    schedule(tasks: [Task!]!): [Int!]!

    # Request to abort one or more scheduled tasks
    abort(taskIds: [Int!]!): [Boolean!]!

    # Pause execution of one or more scheduled tasks
    pause(taskIds: [Int!]!): [Boolean!]!

    # Resume execution of one or more paused tasks
    resume(taskIds: [Int!]!): [Boolean!]!
}
```

## Usage
```graphql
#import * from "ens/wraps.eth:concurrency@1.0.0"
```

And implement the interface methods within your programming language of choice.

## Source Code
[Link](https://github.com/polywrap/std/concurrency)

## Known Implementations
[Link](https://github.com/polywrap/concurrency/tree/master/implementations)