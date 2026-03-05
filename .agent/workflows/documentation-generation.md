---
description: Generate comprehensive TSDoc/JSDoc for components, hooks, and utilities.
---

1.  **Analyze Context**
    - Read the target file(s) to understand functionality, inputs (props/params), and outputs (returns).
    - Identify key logic, side effects, and edge cases.

2.  **Generate Documentation**
    - **Components**:
      - Description: What does it do? What is it for?
      - Props: Document complex props or those with non-obvious purposes.
      - Returns: Description of the rendered UI.
    - **Hooks**:
      - Description: Purpose and logic.
      - Params: Input arguments.
      - Returns: Returned values/functions.
      - Example: A code block showing basic usage.
    - **Utilities/Functions**:
      - Description: Functionality (e.g., maps logic, formatting).
      - Params: Inputs.
      - Returns: Outputs.
      - Throws: Potential errors thrown.

3.  **Apply Documentation**
    - Insert the comments immediately before the export statement.
    - Use JSDoc `/** ... */` syntax.
    - Ensure types are referenced correctly (e.g., `returns {JSX.Element}`).

4.  **Verify & Refactor**
    // turbo
    - Run `bun run lint` to check for line-length violations or other issues.
    - If the file exceeds line limits (e.g., 150 lines for components), refactor by:
      - Extracting sub-components to separate files.
      - Moving types/enums to `src/types`.
      - Extracting utility functions to `src/lib`.
    - Check for syntax errors.
