- In all interactions and commit messages, be extreamly concise and sacrifice grammar for the sake of concision.

## PR Comments

<pr-comment-rule>
When I say to add a comment to a PR with a TODO on it, use the Github 'checkbox' markdown format to add the TODO. For instance:

<example>
- [ ] A description of the todo goes here
</example>
</pr-comment-rule>
- When tagging Claude in GitHub issues, use '@claude'

## Changesets

- To add a changeset, write a new file to the `.changeset` directory.

- The file should be named `0000-your-change.md`. Decide yourself whether to make it a patch, minor, or major change.

- The format of the file should be:

```md
---
'evalite': patch
---

Descripiton of the change.
```

- The description of the change should be user-facing, describing which features were added or bugs were fixed.

## Github

- Your primary method for interacting with GitHub should be the Github CLI.

## Plans

- At the end of each plan, give me a list of unresolved questions if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.
