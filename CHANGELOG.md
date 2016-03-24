# The bunyan tree changelog

This changelog has to be modified this way:

1. each time a new modification is commited, it must be described as the top item of the *Current version* paragraph and tested with:

   ```sh
   npm run check && npm test
   ```

2. once a new release on the master branch has to be defined, it must be tagged with:

   ```sh
   npm version <major|minor|patch> -m "description of what revision %s provides"
   git push
   git push --tags
   ```

3. the paragraph *Current version* is modified and becomes *vX.Y.Z* (depending on the new tag)
4. a new paragraph *Current version* is created on top of *vX.Y.Z*
5. the changelog modification is immediately commited to the master branch

## Current version

## v1.1.1

- [FIX] ensure ES5 compatibility

## v1.1.0

- [FIX] issue #1: Missing example for child declaration
- [FIX] update dependencies
- [FIX] added a changelog
- [FEA] seed returns the logger to chain calls

## v1.0.0

- [BRK] all bunyan methods can now be applied recursively
- [FIX] update dependencies
- [FIX] minimal testing

## v0.0.2

- [FIX] changed name to tsante-bunyan-tree to comply with TS npm repo rules

## v0.0.1

- initial revision
