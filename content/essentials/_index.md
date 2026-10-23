---
# Site building blocks, not pages: the footer (footer.md, layouts/partials/main/footer.html) and the
# "page not found" page's text (404.md, layouts/404.html). Nothing here gets a page or a URL of its own.
build:
  render: never
  list: never
cascade:
  build:
    render: never
    list: local
---
