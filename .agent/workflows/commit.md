---
description: Generate a professional commit message from staged changes
---

### Workflow Steps:

1. **Analyze Staged Changes**
   Analyze the current changes to understand what has been modified:

   ```bash
   git diff --cached

   ```

2. Generate Message Text ONLY Based on the diff output, provide a commit message.

CRITICAL CONSTRAINTS:

- DO NOT output the message inside a bash code block.
- DO NOT suggest or execute any git commit command.
- Simply provide the message as plain text so I can copy and paste it myself.
- Follow the Conventional Commits specification (e.g., feat:, fix:).
- Keep the subject line under 50 characters.
