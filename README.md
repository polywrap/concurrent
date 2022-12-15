# Polywrap Concurrent

An interface and implementations for concurrent Polywrap invocations.

Table Of Contents:
1. [Concurrent Interface](./interface/README.md)
2. [Concurrent Implementation (JavaScript Promise)](implementations/js/README.md)

## A quick primer terminology

The interface uses some terms to describe concurrent programming that are common in some languages, but absent in others.

```
concurrent
-> task(s)
-> worker(s)
```

Defining terms:
- concurrent plugin = an implementation of the concurrent interface, using a specific concurrency mechanism (threads, promises, etc)
- task = a wrapper invocation
- worker = an instance of the underlying concurrency mechanism (thread, promise, etc)

You can:
- set max number of workers
- schedule tasks
- check status of tasks
- gather results of tasks (first, all, any)
- abort tasks