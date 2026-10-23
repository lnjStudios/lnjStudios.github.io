---
# Home carousel. The slides (01-*.md, 02-*.md, ...) are headless cards on the home page: no page of their own,
# but listed so layouts/partials/carousel.html finds them. The pages their buttons open (newsletter.md,
# parts.md) live here too and opt back in to a page with `build: {render: always}`.
build:
  render: never
  list: never
cascade:
  build:
    render: never
    list: always
---
