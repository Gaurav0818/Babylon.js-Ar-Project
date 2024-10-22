import * as BABYLON from 'babylonjs';

export class InputHandler {
    constructor(scene, player)
    {
        this.scene = scene;
        this.player = player;
        this.init();
    }
    init()
    {
        let startingDistance = null;
        let initialScale = this.player.scaling.clone();

        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.event.touches && pointerInfo.event.touches.length === 2) {
                        startingDistance = this.getDistance(pointerInfo.event.touches);
                        initialScale = this.player.scaling.clone();
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    startingDistance = null;
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (startingDistance && pointerInfo.event.touches && pointerInfo.event.touches.length === 2) {
                        const currentDistance = this.getDistance(pointerInfo.event.touches);
                        const pinchRatio = currentDistance / startingDistance;
                        this.player.scaling = initialScale.scale(pinchRatio);
                    }
                    break;
            }
        });
    }

    getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}