# terra

terra is a JavaScript library for browser-based cellular automata and biological simulations. Register rules, populate a grid, and animate it on a canvas.

See the [API guide and examples](https://rileyjshaw.com/terra/).

## Install from source

Clone the repository, install its dependencies with Bun 1.3.14, and build the browser bundle:

```sh
git clone https://github.com/rileyjshaw/terra.git
cd terra
bun install
bun run build
```

Load `dist/terra.min.js` in a browser page. It exposes the library as `window.terra`.

## Quick start

Add this example to a page served from the repository root after you build the bundle:

```html
<script src="./dist/terra.min.js"></script>
<script>
  const terra = window.terra;

  terra.registerCA({
    type: 'life',
    color: [255, 255, 255],
    colorFn() {
      return this.alive ? `${this.color},1` : '0,0,0,0';
    },
    process(neighbors) {
      const aliveNeighbors = neighbors.filter(
        ({creature}) => creature && creature.alive,
      ).length;
      this.alive = aliveNeighbors === 3 || (this.alive && aliveNeighbors === 2);
      return true;
    },
  }, function () {
    this.alive = Math.random() < 0.5;
  });

  const simulation = new terra.Terrarium(50, 50, {periodic: true});
  simulation.grid = simulation.makeGrid('life');
  simulation.animate();
</script>
```

This creates a random Game of Life grid with wrapping edges.

## Develop

Run these commands from the repository root:

```sh
bun install
bun run check
bun run format
bun run typecheck
bun run test
bun run test:smoke
```

`bun run check` checks formatting and lint rules. `bun run format` applies formatting.
`bun run test` runs unit tests and the type check. `bun run test:smoke` builds the package and checks its package entry and browser bundle.
Use `bun run build` to build without the smoke test. It writes `dist/terra.js`, `dist/terra.min.js`, and the bundled declarations in `dist/terra.d.ts`.

## Contribute

The API is in beta and may change. Try the library and report bugs or confusing behavior in [GitHub Issues](https://github.com/GlennSandoval/terra/issues).
Discuss major changes in an issue before you open a pull request.

## License

MIT. See [LICENSE](LICENSE).
