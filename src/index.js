import { Scene, WebGLRenderer } from 'three';
import { createWorld } from './building';
import { height, width } from './conf';
import { addHook, start } from './loop';
import { createPlayer } from './player';

const scene = new Scene();
const renderer = new WebGLRenderer();

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const world = createWorld();
scene.add(world);

const {camera, player} = createPlayer({x: -10, y: 0});
scene.add(player);

addHook(() => renderer.render(scene, camera));

start();