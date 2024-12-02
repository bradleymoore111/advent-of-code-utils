// Load monaco!
// require is provided by loader.min.js.
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
require(["vs/editor/editor.main"], bootstrap);

const {Subject, map, debounceTime, timeout, tap} = rxjs;

function actualdata() {
    infcounter = 0;
    return document.getElementById("actualdata").value.trim();
}

function sampledata(n) {
    infcounter = 0;
    n ??= 1;

    return document.getElementById("sampledata" + n).value.trim();
}

let editor;

function bootstrap() {
    const latestCode = new Subject();
    editor = monaco.editor.create(document.getElementById('container'), {
        value: `// ...using data = data
var lines = data.split('\\n');`,
        language: 'javascript',
        theme: 'vs-dark',
        glyphMargin: true,
    });

    latestCode.pipe(
        map(() => editor.getValue()),
        debounceTime(750),
    ).subscribe(e => run(e));
    editor.getModel().onDidChangeContent(e => latestCode.next(e));
}

function run(code) {
    const worker = new Worker("worker.js");
    input = sampledata();
    worker.postMessage({
        code,
        input,
    });
    worker.onmessage = (response) => handle(response.data);
}

function handle(response) {
    if (response instanceof Error) {
        highlight(response.lineNumber);
        return;
    }
    console.log("Yuh?", response, response instanceof Error, response.lineNumber);
}

// Listen to monaco!