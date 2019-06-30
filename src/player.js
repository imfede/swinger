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

export default class Player {
    constructor({ x, y }) {
        const geometry = new BoxGeometry(player_w, player_h, player_d);
        const material = new MeshBasicMaterial({ color: 0xff00ff });
        const material_wireframe = new MeshBasicMaterial({ color: 0x0, wireframe: true });

        this.group = new Group();
        this.group.add(new Mesh(geometry, material));
        this.group.add(new Mesh(geometry, material_wireframe));
        this.group.position.set(x, y, player_d / 2);

        this.camera = new PerspectiveCamera(90, width / height, 0.1, 1000);
        this.camera.position.z = 0.5;
        this.camera.position.x = -2.5;
        this.camera.rotateZ(-Math.PI / 2);
        this.camera.rotateX(Math.PI / 3);
        this.group.add(this.camera);
        addKeyMapping(KeyCode.KEY_UP, () => this.camera.rotateX(Math.PI / 32));
        addKeyMapping(KeyCode.KEY_DOWN, () => this.camera.rotateX(-Math.PI / 32));
        addKeyMapping(187, () => this.camera.position.x += 0.5);
        addKeyMapping(189, () => this.camera.position.x -= 0.5);
        addKeyMapping(KeyCode.KEY_OPEN_BRACKET, () => this.camera.position.z += 0.5);
        addKeyMapping(KeyCode.KEY_CLOSE_BRACKET, () => this.camera.position.z -= 0.5);

        this.acc = acc_base.clone();
        this.vel = new Vector3();

        this.acc_r = new Vector3();
        this.vel_r = new Vector3();

        this.hookControls();

        addHook(() => {
            // rotation
            const angle = this.vel_r.length();
            this.group.rotateOnAxis(this.vel_r.normalize(), angle);
            this.vel_r.copy(this.acc_r);

            // translation
            this.group.position.add(this.vel);

            if (!this.isFlying()) {
                // ground 
                this.group.position.setZ(player_d / 2);
                if (this.vel.z < 0) {
                    this.vel.setZ(0);
                }

                // friction
                this.vel.multiplyScalar(0.5);
            }

            this.vel.add(this.acc);
            this.vel.clamp(vel_min, vel_max);
            this.acc.copy(acc_base);
        });
    }

    isFlying() {
        return this.group.position.z > player_d / 2;
    }

    addAbsoluteAcc(absAcc) {
        this.acc.add(absAcc);
    }

    addRelativeAcc(relAcc) {
        const currentRot = this.group.quaternion;
        const rotated_acc = relAcc.clone().applyQuaternion(currentRot);
        this.acc.add(rotated_acc);
    }

    subRelativeAcc(relAcc) {
        this.addRelativeAcc(relAcc.clone().negate());
    }

    hookControls() {
        addKeyMapping(KeyCode.KEY_A, () => this.acc_r.setZ(0.1), () => this.acc_r.setZ(0));
        addKeyMapping(KeyCode.KEY_D, () => this.acc_r.setZ(-0.1), () => this.acc_r.setZ(0));

        const controls_acc = new Vector3();
        addKeyMapping(KeyCode.KEY_W, () => controls_acc.add(acc_forward), () => controls_acc.sub(acc_forward));
        addKeyMapping(KeyCode.KEY_S, () => controls_acc.add(acc_backward), () => controls_acc.sub(acc_backward));
        addKeyMapping(KeyCode.KEY_Q, () => controls_acc.add(acc_left), () => controls_acc.sub(acc_left));
        addKeyMapping(KeyCode.KEY_E, () => controls_acc.add(acc_right), () => controls_acc.sub(acc_right));

        addHook(() => {
            if (!this.isFlying()) {
                this.addRelativeAcc(controls_acc);
            }
        })

        addKeyMapping(KeyCode.KEY_SPACE, () => this.vel.add(acc_jump));
    }

    getGroup() {
        return this.group;
    }

    getCamera() {
        return this.camera;
    }
}