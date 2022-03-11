# exporting ghost

```bash
# Export ghost content JSON in labs section

# Get all content
scp -r GHOST_SERVER:/opt/carlosbaraza.com/ghost/content content

# Convert to markdown
node ghost-to-md/index.js ghost.2022-03-10-20-19-09.json -o ../data/blog/
```
