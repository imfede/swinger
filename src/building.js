import { BoxGeometry, MeshBasicMaterial, Mesh, Group } from 'three';
import _ from 'lodash';

export function createBuilding({ x, y }, { w, h, d }) {
    const geometry = new BoxGeometry(w, h, d);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const material_wireframe = new MeshBasicMaterial({ color: 0x0, wireframe: true });

    const group = new Group();
    group.add(new Mesh(geometry, material));
    group.add(new Mesh(geometry, material_wireframe));
    group.position.set(x, y, d / 2);

    return group;
}

export function createWorld(number = 200) {
    const group = new Group();
    for (let i = 0; i < number; i++) {
        group.add(createBuilding(
            {
                x: _.random(-100, 100, true),
                y: _.random(-100, 100, true)
            }, {
                h: _.random(1, 5, true),
                w: _.random(1, 5, true),
                d: _.random(1, 15, true)
            }));
    }

    return group;
}