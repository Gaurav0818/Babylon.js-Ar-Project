import * as BABYLON from "babylonjs";

export const handlePlayerInput = (scene, player, xr) =>
{
    let startX = 0;
    let isDragging = false;

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.event.pointerType === 'touch') {
                    startX = pointerInfo.event.clientX;
                    isDragging = true;
                }
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                if (isDragging && pointerInfo.event.pointerType === 'touch') {
                    const currentX = pointerInfo.event.clientX;

                    const deltaX = currentX - startX;

                    const rotationSpeed = 0.005; 

                    if (player && player.rootNodes[0]) {
                        player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0); 
                    }

                    startX = currentX;
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                isDragging = false;
                break;
            default:
                break;
        }
    });

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log('POINTER DOWN');
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller) {
                        const globalViewport = xr.baseExperience.camera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
                        const screenCoords = BABYLON.Vector3.Project(controller.pointer.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), globalViewport);
                        startX = screenCoords.x;
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                console.log('POINTER MOVE');
                if (xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
                    const controller = xr.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
                    if (controller) {
                        const globalViewport = xr.baseExperience.camera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
                        const screenCoords = BABYLON.Vector3.Project(controller.pointer.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), globalViewport);
                        console.log(screenCoords);
                        const currentX = screenCoords.x;
    
                        const deltaX = currentX - startX;
    
                        const rotationSpeed = 0.005; 
    
                        if (player && player.rootNodes[0]) {
                            player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0);
                        }
    
                        startX = currentX;
                    }
                };
                break;
            default:
                console.log('DEFAULT TYPE...?');
                break;
        }
    });
} 