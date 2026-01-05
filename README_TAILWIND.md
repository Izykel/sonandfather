Tailwind setup for this project

Files added/updated:

- package.json — scripts: `build:css`, `watch:css` (devDependencies listed)
- tailwind.config.cjs — content configured for `index.html`
- postcss.config.cjs — runs Tailwind and Autoprefixer
- src/input.css — Tailwind directives
- index.html — now links to `./dist/styles.css`
- styles.css — placeholder (project originally had this file)

To install and build (PowerShell):

```powershell
cd "C:\Users\User\Desktop\son_and_father"
npm install
npm run build:css
```

Or run watch for development:

```powershell
npm run watch:css
```

Expected notes:

- `npm install` will install devDependencies from package.json.
- `npm run build:css` will create `dist/styles.css` containing the compiled Tailwind CSS.

If you want me to run these commands here, confirm and I will attempt them.
