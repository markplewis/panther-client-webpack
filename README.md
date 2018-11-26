## Production build

Run `npm run serve:prod`

Webpack appends cache-busting hash tokens to the file paths for the production build. All of the assets on Page 2 should load correctly because that page's HTML is generated via `HtmlWebpackPlugin`, which is aware of the hash tokens. Page 1, however, contains static references to the raw files, so it isn't aware of the hash tokens. This means that the assets on Page 1 will not load correctly.

## Development build

Run `npm run serve:dev`

Webpack doesn't append cache-busting hash tokens to the file paths for the development build. This means that the assets on both Page 1 and Page 2 should load correctly.
