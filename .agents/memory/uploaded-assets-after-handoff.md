---
name: Uploaded assets after project handoff
description: Where user-uploaded files land after a conversation is moved into a project.
---

After a conversation-to-project handoff, uploaded files may be preserved under the conversation workspace rather than the project-root `attached_assets` directory expected by the Vite alias.

**Why:** A valid logo import failed at runtime because the asset existed only in the preserved conversation files after handoff.

**How to apply:** Before using an uploaded file through `@assets`, locate it, mirror the required asset into the project-root `attached_assets` directory, and then restart the artifact workflow.