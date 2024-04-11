# Building a Secure Sandbox Environment with `node:vm`

**Abstract**: The widespread application of JavaScript introduces a crucial challenge in software development: ensuring secure code execution. The `node:vm` module in Node.js offers a method for creating isolated execution environments, though it comes with security limitations. This paper explores extending the `node:vm` module to develop a new, more secure sandbox environment, aiming to address the discontinuation of the `vm2` library. By detailing design strategies and core implementations, we aim to provide developers with a secure and flexible solution for safely executing third-party or untrusted code. Additionally, the paper discusses the sandbox's application fields and limitations, emphasizing its suitability and limitations in specific scenarios.

**Authors**:
- Wanjo Chan (@mgttt), main author, responsible for sandbox design and implementation, wanjochan@gmail.com
- @XmiliaH, contributed numerous sandbox escape test cases, **and is of the view that this will never be secure**.
- @j4k0xb, contributed sandbox escape cases

The critical importance of securely executing third-party or untrusted code in modern software development is undeniable. While JavaScript's dynamic and flexible nature boosts development efficiency, it also poses numerous security challenges. Node.js's `node:vm` module facilitates the creation of isolated execution environments, providing effective code segregation. However, security vulnerabilities reported historically have attracted significant community attention. Despite efforts like the `vm2` library to construct safer sandboxes over `node:vm`, foundational issues led to the eventual discontinuation of `vm2` [1].

This paper aims to delve into extending the `node:vm` module to forge a new, secure sandbox environment, striving to fill the void left by the `vm2` library. The developed code is publicly accessible on GitHub [2].

## Overview of Node.js `node:vm` Module

The `node:vm` module enables the creation of an isolated JavaScript execution environment, equipped with custom global variables, thereby isolated from the primary Node.js environment. This capability allows developers to execute third-party code safely, effectively mitigating potential malicious impacts on the main environment.

## Strategy for Designing an Extended Sandbox Environment

The cessation of the `vm2` library has increased the demand for a new sandbox environment based on `node:vm`. Our goal is to construct a sandbox that can safeguard against threats like:

- Prototype pollution
- Global variable leakage
- Asynchronous operation hijacking

### Core Implementation Strategies

1. **Blocking Global Variables**: Employing `vm.createContext` to create a clean execution context, where potentially dangerous global variables and functions, such as `eval` and `Function`, are deleted or overridden.

2. **Overwriting Prototype Methods and Protecting `Promise`**: To prevent malicious code from escaping the sandbox environment, we not only intercept and modify key methods on the prototype chain but also implement measures to protect `Promise` prototype methods from tampering. By maintaining references to these methods and rigorously checking their integrity at sandbox initialization, we ensure their unmodified state, safeguarding asynchronous programming within the sandbox.

3. **Execution Depth Control**: Averting Denial of Service (DoS) attacks due to infinite recursion through recursive depth detection and control mechanisms.

4. **Asynchronous Operation Management and Dynamic Module Import Control**: We achieve strict control over dynamic module imports and manage asynchronous operations through a customized `importModuleDynamically` handling function. This approach prevents unauthorized module loading, ensuring all dynamically loaded code executes securely within the sandbox environment.

### Detailed Code Practices

The sandbox environment's core expansion implementation is demonstrated through key functions such as:

- `jevalx_raw`: The basic execution function, responsible for code execution using `vm.createScript`.
- `findEvilGetter`: A crucial function designed to identify malicious getter functions on the prototype chain, enhancing the sandbox's security against prototype pollution attacks.
- `jevalx_ext`: The extended execution function, tasked with creating and initializing the sandbox environment, meticulously managing global variables.
- `jevalx_core`: The core asynchronous execution function, enhancing control over asynchronous operations by capturing unhandled Promise rejections and avoiding security vulnerabilities from asynchronous operations.

## Updated Security Features

To enhance the sandbox environment's security against prototype pollution attacks, we've implemented an improved detection mechanism, `findEvil`, which meticulously scans the prototype chain for malicious accessor properties. This is a critical update aimed at identifying and mitigating potential threats more efficiently.

Additionally, our sandbox now includes robust measures to secure `Promise` and `Object` prototypes from being tampered with. We've also introduced a controlled environment for dynamic module imports using the `importModuleDynamically` function, ensuring only safe and approved modules are loaded, further safeguarding against unauthorized code execution.

## Performance Optimization

Recognizing the importance of maintaining optimal performance while ensuring security, we've deployed several optimizations. These include streamlining the execution process and minimizing overhead associated with security checks. These enhancements not only improve the execution speed but also ensure that the sandbox remains lightweight and efficient.

## Practical Use Cases

One notable application of our sandbox environment is in the development of secure, isolated testing environments for evaluating third-party scripts. By leveraging our enhanced security features, developers can safely execute and test external code, minimizing risks to their own systems.

For instance, our sandbox has been utilized in a project aimed at analyzing and sandboxing user-generated scripts in real-time, demonstrating its capability to provide both security and flexibility.

## Applications and Limitations of the Sandbox

Designed not as a full-fledged virtual machine but as a tool for running JavaScript code within a predefined secure context, the sandbox provides a level of code isolation and execution control without the full features of traditional virtual machines, such as complete OS emulation or hardware virtualization.

### Main Applications

1. **Implementing JS Syntax APIs**: Useful for developing scalable web applications and services, the sandbox can build and test APIs that implement JavaScript syntax. Running user or third-party code in a secure environment ensures the main application's security remains uncompromised, as applied in our KK project [3].

2. **Strategy Files in Quantitative Systems**: Similar to popular quantitative trading script languages like Pine Script [4], the sandbox enables users to write custom strategies for quantitative trading systems, ensuring security and isolation while leveraging JavaScript's capabilities.

### Limitations

Although the sandbox offers a secure environment for executing complex JavaScript code, it's unsuitable for scenarios requiring the full features of a virtual machine. Focused on security and lightweight, its performance and functionality limits should be acknowledged.

## Security Considerations and Future Outlook

The `node:vm`-based sandbox's strong code isolation necessitates vigilance regarding Node.js updates and newly discovered security vulnerabilities. Ongoing security reviews and sandbox updates are vital for maintaining security.

With the evolving ECMAScript standard and new feature introductions, future sandbox environments are anticipated to accommodate more complex applications and implement more refined control mechanisms.

## Conclusion

Extending a new sandbox environment on top of `node:vm` not only effectively bridges the gap left by the `vm2` library's discontinuation but also provides a more secure and flexible solution for executing third-party or untrusted code. As technology progresses and security practices deepen, we are optimistic about this approach's potential to offer robust security assurances for Node.js applications.

## References

[1] P. Simek, “Notice on the discontinuation of vm2 updates,” 2020. [Online]. Available: [https://github.com/patriksimek/vm2/issues/533].

[2] Wanjo Chan, “jevalx (JsSandbox)” n.d. [Online]. Available: [https://github.com/wanjo-tech/vm2/blob/main/jevalx.js].

[3] Wanjo Chan, "KK Project," n.d. [Online]. Available: [https://github.com/wanjo-tech/kk].

[4] "Pine Script® language reference manual," TradingView, n.d. [Online]. Available: [https://www.tradingview.com/pine-script-reference/v5/].
