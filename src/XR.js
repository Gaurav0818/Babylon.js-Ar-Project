import * as BABYLON from "babylonjs";

export const initXR = async (scene) =>
{
    const defaultXRExperience = await scene.createDefaultXRExperienceAsync(
    {
        uiOptions:
        {
            sessionMode: "immersive-ar",
            referenceSpaceType: "local-floor",
        },
        pointerSelectionOptions: 
        {
            enablePointerSelectionOnAllControllers: true,
        },
    });

    const xrInput = defaultXRExperience.input;

    const le = defaultXRExperience.baseExperience.featuresManager.enableFeature
    (
        BABYLON.WebXRFeatureName.LIGHT_ESTIMATION, 
        "latest", 
        {
			setSceneEnvironmentTexture: true,
			cubeMapPollInterval: 1000,
			createDirectionalLightSource: true,
			reflectionFormat: 'srgba8',
			disableCubeMapReflection: true
        }
    );

    const shadowGenerator = new BABYLON.ShadowGenerator(512, le.directionalLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.2);

    return defaultXRExperience;
}