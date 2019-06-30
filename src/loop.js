
var running = false;
const hooks = [];

function animate() {
    if(running)
        requestAnimationFrame(animate);

    hooks.forEach((hook) => hook.apply());
}

export function start() {
    running = true;
    animate();
}

export function stop() {
    running = false;
}

export function addHook(fn) {
    hooks.push(fn);
}