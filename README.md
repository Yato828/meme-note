# Meme Note

Static landing page for the Meme Note token.

## Project Structure

- `index.html` - page markup
- `styles.css` - visual design and responsive layout
- `script.js` - token writing animation and local archive
- `assets/` - images and visual font reference
- `.nojekyll` - lets GitHub Pages serve files directly
- `netlify.toml` - Netlify static deploy config
- `vercel.json` - Vercel static deploy config

## Run Locally

Open `index.html` in a browser. No build step is required.

For a local web server, any static server works, for example:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Deploy

GitHub Pages:

1. Push the repository to GitHub.
2. In repository settings, enable Pages from the main branch root.

Netlify:

1. Import the repository.
2. Use the repository root as the publish directory.
3. No build command is needed.

Vercel:

1. Import the repository.
2. Deploy as a static site from the repository root.

The social and buy buttons currently use `#` placeholders in `index.html`.
