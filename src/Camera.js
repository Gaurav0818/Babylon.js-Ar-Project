import * as BABYLON from "babylonjs";

export const initCamera = async (scene) =>
{
    const camera = new BABYLON.ArcRotateCamera("camera", 1.57, 1.4, 8, new BABYLON.Vector3(0, 5, 10), scene);
    camera.inputs.remove(camera.inputs.attached.mousewheel);
    camera.lowerBetaLimit = 0.75;
    camera.upperBetaLimit = 1.7;

    scene.activeCamera = camera;
    //camera.attachControl(true); // Attach camera controls to canvas
}