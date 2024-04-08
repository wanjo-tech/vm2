# Building a Secure Sandbox Environment with `node:vm`

**Abstract**: As JavaScript sees widespread use, ensuring the security of code execution has become a crucial challenge in software development. The `node:vm` module in Node.js offers a way to create isolated execution environments, albeit with security limitations. This paper explores the extension of the `node:vm` module to develop a new, more secure sandbox environment, aiming to fill the gap left by the discontinued maintenance of the `vm2` library. By detailing design strategies and core implementations, this paper aims to provide developers with a secure and flexible solution for executing third-party or untrusted code safely. Additionally, it discusses the sandbox's application fields and limitations, emphasizing its suitability and limitations in specific scenarios.

**Authors**:
- Wanjo Chan (@mgttt), main author, responsible for sandbox design and implementation, wanjochan@gmail.com
- @XmiliaH, provided a significant number of sandbox escape test cases
- @j4k0xb, contributed some sandbox escape cases

The importance of securely executing third-party or untrusted code in modern software development cannot be overstated. While JavaScript's dynamic and flexible nature significantly boosts development efficiency, it also introduces numerous security challenges. Node.js's `node:vm` module offers a way to create isolated execution environments, effectively segregating code execution, yet historically reported security vulnerabilities have raised widespread concern. Despite attempts like the `vm2` library to build safer sandboxes atop `node:vm`, fundamental issues led to `vm2`'s eventual discontinuation [1].

This paper aims to explore the extension of the `node:vm` module to create a new, secure sandbox environment, intending to fill the void left by the `vm2` library. The code is publicly available on GitHub [2].

## Overview of Node.js `node:vm` Module

The `node:vm` module allows the creation of an isolated JavaScript execution environment, equipped with custom global variables, isolated from the main Node.js environment. This feature enables developers to safely execute third-party code, effectively preventing potential malicious operations from affecting the main environment.

## Strategy for Designing an Extended Sandbox Environment

With the discontinuation of the `vm2` library, the need for extending a new sandbox environment based on `node:vm` has grown. Our aim is to build a sandbox capable of defending against security threats such as:

- Prototype pollution
- Global variable leakage
- Asynchronous operation hijacking

### Core Implementation Strategies

1. **Blocking Global Variables**: By creating a pristine execution context with `vm.createContext`, potentially dangerous global variables and functions like `eval` and `Function` are deleted or overridden.

2. **Overwriting Prototype Methods**: By intercepting and modifying key methods on the prototype chain like `Promise`, we prevent malicious code from escaping the sandbox environment.

3. **Execution Depth Control**: Through recursive depth detection, we avoid Denial of Service (DoS) attacks caused by infinite recursion.

4. **Asynchronous Operation Management**: By customizing the `importModuleDynamically` handler function, dynamic module imports are strictly controlled, preventing the loading of unauthorized modules.

### Detailed Code Practices

Key functions reflecting the core expansion implementation of the sandbox environment include:

- `jevalx_raw`: Serves as the basic execution function, responsible for executing code using `vm.createScript`.
- `findEvilGetter`: Searches for malicious getter functions on the prototype chain.
- `jevalx_ext`: Acts as the extended execution function, responsible for creating and initializing the sandbox environment, managing global variables meticulously.
- `jevalx_core`: The core asynchronous execution function, enhancing control over asynchronous operations by capturing unhandled Promise rejections, avoiding security vulnerabilities from asynchronous operations.

## Applications and Limitations of the Sandbox

The sandbox based on the `node:vm` module is not intended to offer a full-fledged virtual machine. Instead, it is designed as a tool allowing JavaScript code to run in a predefined secure context. This design means that while the sandbox can provide a level of code isolation and execution control, it does not include all features of traditional virtual machines, such as complete operating system emulation or hardware virtualization.

### Main Applications

1. **Implementing JS Syntax APIs**: The sandbox environment can be used to build and test APIs implementing JavaScript syntax, particularly useful for developing scalable web applications and services. By running user or third-party code in a secure sandbox environment, developers can ensure the main application's security is uncompromised.  It's applied in our KK project [3]

2. **Strategy Files in Quantitative Systems**: Similar to popular quantitative trading script languages like Pine Script[4], this sandbox environment enables users to write custom strategies for quantitative trading systems. The strategy files executed within the sandbox can leverage JavaScript's powerful features while ensuring the execution environment's security and isolation.

### Limitations

While this sandbox offers a relatively secure environment for executing complex JavaScript code, it is not suitable for scenarios requiring full virtual machine features. The sandbox is designed with a focus on security and lightweight, hence its performance and functionality limitations should be considered when in use.

## Security Considerations and Future Outlook

Despite the strong code isolation provided by the `node:vm`-based sandbox environment, vigilance is required regarding Node.js updates and newly discovered security vulnerabilities. Continuous security reviews and timely updates of the sandbox environment are crucial for maintaining its security.

As the ECMAScript standard evolves and new features are introduced, future sandbox environments are expected to accommodate more complex applications and implement finer control mechanisms.

## Conclusion

By extending a new sandbox environment atop `node:vm`, we not only effectively filled the gap left by the discontinuation of the `vm2` library but also provided a more flexible and secure solution for executing third-party or untrusted code. With continuous technological advancement and deeper security practices, we believe this approach will provide solid security assurances for Node.js applications.

## References

[1] P. Simek, “Notice on the discontinuation of vm2 updates,” 2020. [Online]. Available: https://github.com/patriksimek/vm2/issues/533.

[2] Wanjo Chan, “jevalx (JsSandbox)” n.d. [Online]. Available: https://github.com/wanjo-tech/vm2/blob/main/jevalx.js.

[3] Wanjo Chan, "KK Project," n.d. [Online]. Available: [https://github.com/wanjo-tech/kk].

[4] "Pine Script® language reference manual," TradingView, n.d. [Online]. Available: [https://www.tradingview.com/pine-script-reference/v5/].


