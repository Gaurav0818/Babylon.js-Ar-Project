import * as BABYLON from "babylonjs";

export const handlePlayerInput = (scene, player, xr) => {
    let startX = 0;
    let initialDistance = 0;
    let initialScale = player.rootNodes[0].scaling.clone();
    let activeTouches = {};

    scene.onPointerObservable.add((pointerInfo) => 
    {
        const touchCount = Object.keys(activeTouches).length;
        switch (pointerInfo.type) 
        {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log('POINTER DOWN');
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) 
                {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller) 
                    {
                        activeTouches[pointerInfo.event.pointerId] = controller;

                        const gripOrPointer = controller.grip ? controller.grip.position : controller.pointer.position;
                        if (gripOrPointer) 
                        {
                            if (touchCount === 0) 
                            {
                                const globalViewport = xr.baseExperience.camera.viewport.toGlobal(
                                    scene.getEngine().getRenderWidth(),
                                    scene.getEngine().getRenderHeight()
                                );

                                const screenCoords = BABYLON.Vector3.Project(
                                    controller.pointer.position,
                                    BABYLON.Matrix.Identity(),
                                    scene.getTransformMatrix(),
                                    globalViewport
                                );

                                startX = screenCoords.x;
                            }

                            if (touchCount === 1) 
                            {
                                const [touch1, touch2] = Object.values(activeTouches);
                                const gripPos1 = touch1.grip ? touch1.grip.position : touch1.pointer.position;
                                const gripPos2 = touch2.grip ? touch2.grip.position : touch2.pointer.position;

                                if (gripPos1 && gripPos2) 
                                {
                                    initialDistance = BABYLON.Vector3.Distance(gripPos1, gripPos2);
                                    initialScale = player.rootNodes[0].scaling.clone();
                                }
                            }
                        }
                    }
                }
                break;

            case BABYLON.PointerEventTypes.POINTERMOVE:
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) 
                {
                    if (touchCount === 1)
                        {
                        // Single touch - rotate
                        const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                        if (controller) 
                        {
                            const globalViewport = xr.baseExperience.camera.viewport.toGlobal(
                                scene.getEngine().getRenderWidth(),
                                scene.getEngine().getRenderHeight()
                            );

                            const screenCoords = BABYLON.Vector3.Project(
                                controller.pointer.position,
                                BABYLON.Matrix.Identity(),
                                scene.getTransformMatrix(),
                                globalViewport
                            );

                            const currentX = screenCoords.x;
                            const deltaX = currentX - startX;

                            const rotationSpeed = -0.005;
                            if (player && player.rootNodes[0]) 
                            {
                                player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0);
                            }

                            startX = currentX;
                        }
                    } 
                    else if (touchCount === 2) 
                    {
                        // Multi-touch - pinch to scale
                        const [touch1, touch2] = Object.values(activeTouches);

                        const gripPos1 = touch1.grip ? touch1.grip.position : touch1.pointer.position;
                        const gripPos2 = touch2.grip ? touch2.grip.position : touch2.pointer.position;

                        if (gripPos1 && gripPos2) 
                        {
                            const currentDistance = BABYLON.Vector3.Distance(gripPos1, gripPos2);
                            const scale = currentDistance / initialDistance;

                            if (player && player.rootNodes[0]) 
                            {
                                player.rootNodes[0].scaling = initialScale.scale(scale);
                            }
                        }
                    }
                }
                break;

            case BABYLON.PointerEventTypes.POINTERUP:
                delete activeTouches[pointerInfo.event.pointerId];
                if (touchCount < 2) 
                {
                    initialDistance = 0;
                }
                break;

            default:
                break;
        }
    });
};
