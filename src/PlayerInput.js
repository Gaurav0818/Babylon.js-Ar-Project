import * as BABYLON from "babylonjs";

export const handlePlayerInput = (scene, player, xr) =>
{
    let startX = 0;
    let initialDistance = 0;
    let initialScale = player.rootNodes[0].scaling.clone();
    let activeTouches = {};

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log('POINTER DOWN');
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR)
                {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller)
                    {
                        const globalViewport = xr.baseExperience.camera.viewport.toGlobal(
                            scene.getEngine().getRenderWidth(),
                            scene.getEngine().getRenderHeight());

                        const screenCoords = BABYLON.Vector3.Project(
                            controller.pointer.position,
                            BABYLON.Matrix.Identity(),
                            scene.getTransformMatrix(),
                            globalViewport);

                        startX = screenCoords.x;
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                console.log('POINTER MOVE');
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR)
                {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller)
                    {
                        const globalViewport = xr.baseExperience.camera.viewport.toGlobal(
                            scene.getEngine().getRenderWidth(),
                            scene.getEngine().getRenderHeight());

                        const screenCoords = BABYLON.Vector3.Project(
                            controller.pointer.position,
                            BABYLON.Matrix.Identity(),
                            scene.getTransformMatrix(),
                            globalViewport);

                        const currentX = screenCoords.x;
    
                        const deltaX = currentX - startX;
    
                        const rotationSpeed = 0.005; 
    
                        if (player && player.rootNodes[0])
                        {
                            player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0);
                        }
    
                        startX = currentX;
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                console.log('POINTER DOUBLE TAP');
                if(xr.baseExperience.state === BABYLON.WebXRState.IN_XR)
                {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if(controller)
                    {
                        initialDistance = BABYLON.Vector3.Distance(controller.grip.position, controller.pointer.position);
                        initialScale = player.rootNodes[0].scaling.clone();
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                console.log('POINTER WHEEL');
                if(xr.baseExperience.state === BABYLON.WebXRState.IN_XR)
                {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if(controller)
                    {
                        const distance = BABYLON.Vector3.Distance(controller.grip.position, controller.pointer.position);
                        const scale = distance / initialDistance;

                        if(player && player.rootNodes[0])
                        {
                            player.rootNodes[0].scaling = initialScale.scale(scale);
                        }
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log('POINTER UP');
                initialDistance = 0;
                break;
            default:
                console.log('DEFAULT TYPE...?');
                break;
        }
    });

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller) {
                        const gripOrPointer = controller.grip ? controller.grip.position : controller.pointer.position;
                        if (gripOrPointer) {
                            activeTouches[pointerInfo.event.pointerId] = controller;

                            if (Object.keys(activeTouches).length === 2) {
                                const [touch1, touch2] = Object.values(activeTouches);
                                const gripPos1 = touch1.grip ? touch1.grip.position : touch1.pointer.position;
                                const gripPos2 = touch2.grip ? touch2.grip.position : touch2.pointer.position;

                                if (gripPos1 && gripPos2) {
                                    initialDistance = BABYLON.Vector3.Distance(gripPos1, gripPos2);
                                    initialScale = player.rootNodes[0].scaling.clone();
                                }
                            }
                        }
                    }
                }
                break;

            case BABYLON.PointerEventTypes.POINTERMOVE:
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR && Object.keys(activeTouches).length === 2) {
                    const [touch1, touch2] = Object.values(activeTouches);

                    const gripPos1 = touch1.grip ? touch1.grip.position : touch1.pointer.position;
                    const gripPos2 = touch2.grip ? touch2.grip.position : touch2.pointer.position;

                    if (gripPos1 && gripPos2) {
                        const currentDistance = BABYLON.Vector3.Distance(gripPos1, gripPos2);

                        const scale = currentDistance / initialDistance;

                        if (player && player.rootNodes[0]) {
                            player.rootNodes[0].scaling = initialScale.scale(scale);
                        }
                    }
                }
                break;

            case BABYLON.PointerEventTypes.POINTERUP:
                delete activeTouches[pointerInfo.event.pointerId];
                if (Object.keys(activeTouches).length < 2) {
                    initialDistance = 0;
                }
                break;

            default:
                break;
        }
    });
} 