import { Scene, WebGLRenderer } from 'three';
import { createWorld } from './building';
import { height, width } from './conf';
import { addHook, start } from './loop';
import Player, { createPlayer } from './player';
import {hook, createTarget, createLine} from './swinger';

const scene = new Scene();
const renderer = new WebGLRenderer();

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const world = createWorld();
scene.add(world);

const player = new Player({x: 0, y: 0});
scene.add(player.getGroup());

const target = createTarget();
scene.add(target);

const line = createLine();
scene.add(line);

hook(world, player, target, line);

addHook(() => renderer.render(scene, player.getCamera()));

start();