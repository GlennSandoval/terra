terra
=====

JS library for cellular automata and simple biological simulations. Documentation and examples live [here](http://rileyjshaw.com/terra/).

## Hacking this library

Use Bun 1.3.14 to manage dependencies and run checks:

```sh
bun install
bun run typecheck
bun run test
bun run test:smoke
```

`bun run typecheck` checks application sources and co-located `.spec.ts` files. `bun run test` runs unit specs
and the type check; `bun run test:smoke` builds the library and smoke-checks the package entry and browser bundle. To build without running
the smoke test, use `bun run build`. Rollup produces the UMD bundle `dist/terra.js`; Terser
writes `dist/terra.min.js`. The latter is the package entry and exposes `terra`
in browsers. Demo sources are not included in this repo, so the former
Bower/Gulp demo tasks are not part of this build.

## Contributing
At this stage **the most important way you can help is to use the library**. The API is in Beta and still flexible. If you discover something that's confusing or hard to work with, document it [here](https://github.com/rileyjshaw/terra/issues). Come up with an idea and try to build it; by using and testing the library you'll find bugs or usability issues that would otherwise go unnoticed.
If you want to make a pull-request on anything labeled 'major', be sure to join the discussion first so we can talk architecture.

That's all, folks! MIT, remixing strongly encouraged.
