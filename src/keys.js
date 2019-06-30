import KeyCode from 'keycode-js';

const mappingDown = {};
const mappingUp = {};
const keyEnabled = {};

for(let i = 0; i<222; i++) {
    keyEnabled[i] = true;
}

export default function addKeyMapping(code, fnDown, fnUp) {
    if(typeof mappingDown[code] !== 'object') {
        mappingDown[code] = [];
    }

    if(typeof mappingUp[code] !== 'object') {
        mappingUp[code] = [];
    }

    if(fnDown) {
        mappingDown[code].push(fnDown);
    }

    if(fnUp) {
        mappingUp[code].push(fnUp);
    }
}

document.addEventListener('keydown', (ev) => {
    const code = ev.keyCode;
    if(mappingDown[code] && keyEnabled[code]) {
        keyEnabled[code] = false;
        mappingDown[code].forEach(fn => fn.apply());
    }
});

document.addEventListener('keyup', (ev) => {
    const code = ev.keyCode;
    keyEnabled[code] = true;
    if(mappingUp[code]) {
        mappingUp[code].forEach(fn => fn.apply());
    }
});