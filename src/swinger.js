import _ from 'lodash';
import { addHook } from "./loop";
import { SphereGeometry, MeshBasicMaterial, Mesh, Geometry, LineBasicMaterial, Line, Vector3 } from 'three';
import KeyCode from 'keycode-js';
import addKeyMapping from './keys';

export function createTarget() {
    const geometry = new SphereGeometry(0.1);
    const material = new MeshBasicMaterial({ color: 0xff9090, wireframe: true });
    return new Mesh(geometry, material);
}

export function createLine() {
    const geometry = new Geometry();
    geometry.vertices = [new Vector3(0, 0, 0), new Vector3(1, 1, 1)];
    const material = new LineBasicMaterial({ color: 0xffffff });
    const line = new Line(geometry, material);
    line.frustumCulled = false; // beacuse bounding boxes are not recalculated
    return line;
}

function findNextTarget(world, player) {
    const victor = new Vector3();
    const camera_vector = player.getCamera().getWorldDirection(victor);
    const player_position = player.getGroup().position;

    const vertices = world.children
        .map(b => b.getObjectByName("solid")
            .geometry
            .vertices
            .map(v => v.clone().add(b.position)))
        .flat()
        .filter(v => v.z > 1) // discard ground vertex
        .map(v => ({
            v: v,
            t: v.clone().sub(player_position)
        }))
        .filter(v => v.t.dot(camera_vector) > 0)
        .map(v => ({
            v: v.v,
            t: v.t,
            da: v.t.clone().projectOnPlane(camera_vector)
        }));

    if (vertices.length > 0) {
        return _.minBy(vertices, v => v.da.length() + v.t.length()).v;
    }
}

export function hook(world, player, target, line) {
    addHook(() => {
        const next = findNextTarget(world, player);
        if (next) {
            target.position.copy(next);
        }
    });

    addKeyMapping(KeyCode.KEY_H, () => startSwing(target, player), () => stopSwing(target, player));

    let fn = () => { };
    function startSwing(target, player) {
        const lockedTarget = target.position.clone();
        fn = addHook(() => {
            line.geometry.vertices = [lockedTarget, player.getGroup().position];
            line.geometry.verticesNeedUpdate = true;

            const rope_acc = lockedTarget.clone().sub(player.getGroup().position);
            player.addAbsoluteAcc(rope_acc.multiplyScalar(0.005));
        });
    }

    function stopSwing(target, player) {
        fn();
    }
}