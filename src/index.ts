import esbuild from "esbuild";
import fs from "fs";
import { isAbsolute, join } from "path";
import { promisify } from 'util'
import resolve, { AsyncOpts } from "resolve";

type resolveCallback = (err: Error | null, resolved?: string) => void;
type ResolveFn = (id: string, opts: AsyncOpts, cb: resolveCallback) => string

const asyncResolve = promisify(resolve as unknown as ResolveFn);
const readFile = fs.promises.readFile;

function CSSPlugin(this: esbuild.Plugin, publicPath: string = "/") {
    this.name = "cssextract";
    this.setup = function(build) {
        build.onResolve({ filter: /\.css$/ }, async ({ path, resolveDir })  => {
            if (isAbsolute(path)) {
                return {
                    path,
                    namespace: "css-file",
                };
            } else {
                const resolvedPath = await asyncResolve(path, { basedir: resolveDir });
                return {
                    path: resolvedPath,
                    namespace: "css-external"
                }
            }
        });

        build.onLoad({ filter: /\.css$/, namespace: "css-external" }, ({ path }) => {
            return {
                contents: `
                    import loadCss from "${join(__dirname, "loader.js")}"
                    import cssPath from "${publicPath}${path}";
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
};

export default CSSPlugin;