# @apollo-link-debug/handle-abort

Debugs when a GraphQL request is aborted using an `AbortController`.

Because the same query can be used in multiple places with separate contexts, it is expected that the AbortController (signal) is provided by the operation itself; rather than creating an AbortController for each request.
