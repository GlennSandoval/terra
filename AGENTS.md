# Agent instructions

- Terra is a TypeScript library for cellular automata and biological simulations. Read `README.md` for project context.
- Use Bun 1.3.14 (`packageManager` in `package.json`). Application source lives in `app/`; unit specs are co-located as `*.spec.ts`, and package smoke tests live in `tests/`.
- `app/main.ts` exports `Terrarium`, `registerCreature`, and `registerCA`. `app/terrarium.ts` handles stepping and animation; `app/creature.ts` handles registered creature and CA behaviors; `app/dom.ts` and `app/display.ts` handle canvas rendering.
- Grids are indexed `grid[x][y]`, but a 2-D array passed to `makeGrid` is read as rows (`content[y][x]`). `Terrarium` creates a canvas in its constructor, so non-browser tests need DOM stubs. Creature types share a registry; use unique names in specs.
- Keep changes consistent with strict TypeScript and Biome. Use the existing code and test patterns; do not hand-edit generated `dist/` bundles or vendored `lodash_custom/` files.
- Run the relevant checks: `bun run check`, `bun run typecheck`, `bun run test`, and, for build or package changes, `bun run test:smoke`. `bun run format` applies formatting across the repository.
