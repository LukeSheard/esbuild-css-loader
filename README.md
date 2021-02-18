# esbuild-css-loader

CSS extraction and loading for esbuild. 

*(Based on ```css-loader``` and ```style-loader``` from webpack).*

Currently esbuild does not support CSS extraction with code-splitting. 
When building multiple entrypoints with esbuild a known workaround is to run
esbuild twice: once with code splitting on, once with it off. This generates large
blobs of CSS to load with each entrypoint but most of that CSS could be shared. 

This plugin extracts each imported CSS into it's own css file and loads it dynamically 
at runtime. 

## Known Caveats: 

* CSS which uses ```@import``` syntax is not supported since the CSS file is not AST parsed
and evaluated. This is fine in most cases since packages generally only ship full CSS files,
but may not work with local design systems. 

* Flashes of unstyled content are a thing (much like ```css-loader``` in webpack). This is 
because the CSS files are loaded inline during import evaluation. 