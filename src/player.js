import { BoxGeometry, MeshBasicMaterial, Mesh, Group, PerspectiveCamera, Vector3 } from 'three';
import KeyCode from 'keycode-js';
import addKeyMapping from './keys';
import { width, height } from './conf';
import { addHook } from './loop';

const player_w = 0.1;
const player_h = 0.1;
const player_d = 0.3;

const controller_speed = 0.1;

const acc_base = new Vector3(0, 0, -0.01);
const acc_forward = new Vector3(controller_speed, 0, 0);
const acc_backward = new Vector3(-controller_speed, 0, 0);
const acc_left = new Vector3(0, controller_speed, 0);
const acc_right = new Vector3(0, -controller_speed, 0);
const acc_jump = new Vector3(0, 0, 0.2);

const vel_min = new Vector3(-1, -1, -10);
const vel_max = new Vector3(1, 1, 10);

export function createPlayer({ x, y }) {
    const geometry = new BoxGeometry(player_w, player_h, player_d);
    const material = new MeshBasicMaterial({ color: 0xff00ff });
    const material_wireframe = new MeshBasicMaterial({ color: 0x0, wireframe: true });

    const group = new Group();
    group.add(new Mesh(geometry, material));
    group.add(new Mesh(geometry, material_wireframe));
    group.position.set(x, y, player_d / 2);

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 0.5;
    camera.position.x = -0.5;
    camera.rotateZ(-Math.PI / 2);
    camera.rotateX(Math.PI / 3);
    group.add(camera);
    addKeyMapping(KeyCode.KEY_UP, () => camera.rotateX(Math.PI / 32));
    addKeyMapping(KeyCode.KEY_DOWN, () => camera.rotateX(-Math.PI / 32));

    const acc = acc_base.clone();
    const vel = new Vector3();

    const acc_r = new Vector3();
    const vel_r = new Vector3();

    addKeyMapping(KeyCode.KEY_W, () => acc.add(acc_forward), () => acc.sub(acc_forward));
    addKeyMapping(KeyCode.KEY_S, () => acc.add(acc_backward), () => acc.sub(acc_backward));
    addKeyMapping(KeyCode.KEY_Q, () => acc.add(acc_left), () => acc.sub(acc_left));
    addKeyMapping(KeyCode.KEY_E, () => acc.add(acc_right), () => acc.sub(acc_right));
    addKeyMapping(KeyCode.KEY_A, () => acc_r.setZ(0.1), () => acc_r.setZ(0));
    addKeyMapping(KeyCode.KEY_D, () => acc_r.setZ(-0.1), () => acc_r.setZ(0));
    addKeyMapping(KeyCode.KEY_SPACE, () => vel.add(acc_jump));

    addHook(() => {
        // rotation
        const angle = vel_r.length();
        group.rotateOnAxis(vel_r.normalize(), angle);
        vel_r.copy(acc_r);

        // translation
        console.log(acc);

        const currentRot = group.quaternion;
        const rotated_vel = vel.clone().applyQuaternion(currentRot);
        group.position.add(rotated_vel);

        if (group.position.z <= player_d / 2) {
            // ground 
            group.position.setZ(player_d / 2);
            if (vel.z < 0) {
                vel.setZ(0);
            }

            // friction
            vel.multiplyScalar(0.5);

            vel.add(acc);
            vel.clamp(vel_min, vel_max);
        } else {
            vel.add(acc_base);
            vel.clamp(vel_min, vel_max);
        }
    });

    return { camera, player: group };
}