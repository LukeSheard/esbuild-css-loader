import "./foo.css";

console.log("Hello!");

const DoAThing = async () => {
    const { render } = await import("./async");
    render();
}

setTimeout(() => DoAThing(), 1000);