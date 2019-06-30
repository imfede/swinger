import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addHook } from './loop';

const KEY = 'devcontrols';
var registered = false

export function enableControls(camera) {
    if(registered) {
        return;
    }

    const controls = new OrbitControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    addHook(() => controls.update());
    registered = true;
}