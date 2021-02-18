const queue: string[] = [];

function loadCss(filename: string) {
    queue.push(filename);
    runQueue();
};

let loading = false;

function runQueue() {
    if (queue.length && !loading) {
        // we're now loading...
        loading = true;

        // remove the first css file to be loaded
        const fileName = queue.splice(0, 1);
        const link = document.createElement("link");
        link.href = "/" + fileName;
        link.rel = "stylesheet";

        // once the css file loads then we are no longer loading
        // and we run the queue again to load any new files that 
        // need loading...
        link.onload = function () {
            loading = false;
            runQueue();
        }

        document.head.appendChild(link);
    }
}

export default loadCss;