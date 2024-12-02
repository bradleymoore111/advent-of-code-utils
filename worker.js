importScripts('utils.js');

onmessage = (message) => {
    const {code, input} = message.data;
    console.log("Nice!!", code, input);
    const data = input;

    const value = (() => {
        try {
            return eval(code);
        } catch (e) {
            return e;
        }
    })();

    postMessage(value);
};