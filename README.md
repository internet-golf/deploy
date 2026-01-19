This action sets up the Internet Golf client CLI so that you can deploy stuff from Github Actions with it.

## Usage:

Here is an sample workflow that uses this action.

```yml
name: Deploy Site

on:
  push:
    branches: ["main"] # or whatever

permissions:
  # IMPORTANT: this enables automatic authentication to the server
  id-token: write
  contents: read

jobs:
  deploy-site:
    runs-on: ubuntu-latest
    steps:
      # this action sets up the CLI:
      - uses: internet-golf/deploy@v0.2.0

        # you can then use the CLI
      - uses: actions/checkout@v5
      - run: |
          golf deploy-content site.com --auth github-oidc --files ./build-files
```

## Developing

To release a new version of this action:

1. Edit action.yml and/or action.js.
2. If you've edited action.js, run `npm run build` to get a bundled version of it and its (unavoidable) dependencies for release.
3. Commit your changes.
4. Add a version tag, like this: `git tag v0.1.1`
5. Push your changes and the tag: `git push; git push origin v0.1.1`
