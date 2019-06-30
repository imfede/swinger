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
    geometry.vertices = [new Vector3(0,0,0), new Vector3(1, 1, 1)];
    const material = new LineBasicMaterial({ color: 0xffffff });
    const line = new Line(geometry, material);
    line.frustumCulled = false;
    return line;
}

export function hook(world, player, target, line) {
    addHook(() => {
        const vertices = world.children
            .map(b => b.getObjectByName("solid")
                .geometry
                .vertices
                .map(v => v.clone().add(b.position)))
            .flat()
            .filter(v => v.z > player.getGroup().position.z);

        if (vertices.length > 0) {
            const vertex = _.minBy(vertices, v => v.distanceToSquared(player.getGroup().position));
            target.position.copy(vertex);
        }
    });

    addKeyMapping(KeyCode.KEY_H, () => startSwing(target, player), () => stopSwing(target, player));

    let fn = () => {};
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