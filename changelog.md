# 4.0.0

- drop `callSync` and `provideSync` and make `call` and `provide` synchronous

# 3.2.0

- made the `provide` functions return an "unprovide" function

# 3.1.0

- expose `callSync` and `provideSync` methods in addition to the existing asynchronous `call` and `provide`

# 3.0.0

- drop support for versions of node before node 6
- stop thinking like an event emitter - only allow one provider per message type
