import esbuild from "esbuild";
import fs from "fs";
import { join } from "path";

const readFile = fs.promises.readFile;

const CSSPlugin: esbuild.Plugin = {
    name: "cssextract",
    setup(build) {
        build.onResolve({ filter: /\.css$/ }, ({ path })  => {
            if (require.resolve(path) === path) {
                return {
                    path,
                    namespace: "css-file"
                };
            } else {
                const cssPath = require.resolve(path);
                return {
                    path: cssPath,
                    namespace: "css-external"
                }
            }
        })

        build.onLoad({ filter: /\.css$/, namespace: "css-external" }, ({ path }) => {
            return {
                contents: `
                    import loadCss from "${join(__dirname, "loader.js")}"
                    import cssPath from "${path}";
                    loadCss(cssPath);
                `,
                resolveDir: process.cwd(),
            }
        });

        build.onLoad({ filter: /\.css$/, namespace: "css-file" }, async ({ path }) => {
            return {
                contents: await readFile(path),
                loader: "file"
            }
        });
    }
}

export default CSSPlugin;