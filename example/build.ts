const esbuild = require("esbuild");
const rimraf = require("rimraf");
const CSSExtractPlugin = require("../").default;
import path from "path";

rimraf(path.join(__dirname, "dist"), () => {
    esbuild.build({
        entryPoints: [ path.join(__dirname, "src", "index.ts") ],
        outdir: path.join(__dirname, "dist"),
        format: "esm",
        splitting: true,
        bundle: true,
        plugins: [
            new CSSExtractPlugin()
        ]
    });
});
