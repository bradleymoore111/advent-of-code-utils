// Load monaco!
// require is provided by loader.min.js.
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }});
require(["vs/editor/editor.main"], bootstrap);

const {Subject, map, debounceTime} = rxjs;

function bootstrap() {
    const latestCode = new Subject();
    const editor = monaco.editor.create(document.getElementById('container'), {
        value: `var data = sampledata();
var lines = data.split('\\n');`,
        language: 'javascript',
        theme: 'vs-dark',
    });

    latestCode.pipe(
        map(() => editor.getValue()),
        debounceTime(750),
    ).subscribe(run);
    editor.getModel().onDidChangeContent(e => latestCode.next(e));
}

function run(code) {
    console.log(code);
    // Spawn a worker!
    const worker = new Worker("worker.js");
}

// Listen to monaco!