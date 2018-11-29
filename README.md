## Fundamentals

This Javascript implementation uses Mocha, Chai, and supports ES6.

```
npm install
npm test 

npm test:watch
```

NOTE: When using IntelliJ IDEA, ```import { expect } from 'chai'``` will likely show up as an unrecognized import.

See https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000357324-Get-rid-of-Unresolved-function-method-variable-warning-in-Jest-test-files
Downloading the chai Javascript library (Preferences->Languages & Frameworks->Javascript->Libraries ->Download...) fixed this problem.


Creating a run config in IDEA:

Under Run/Debug Configurations, add a Mocha test. Name it.
User interface: BDD
Extra Mocha options: --require @babel/register --require @babel/polyfill --watch --reporter min
Test directory: point to the src directory and include subdirectories.
