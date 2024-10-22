import React, { useEffect } from "react";
import * as BABYLON from "babylonjs";
import { SetupEnviornment } from "./LoadMeshes";
import { DebugUI } from "./DebugUI";

export var engine;
var scene;
var canvasEl;
var player;

export const Scene = () => {
	useEffect(() => {
		initEngine();
		return () => {};
	}, []);

	const initEngine = () => {
		canvasEl = document.getElementById("renderCanvas");
		engine = new BABYLON.Engine(canvasEl, true, {
			useHighPrecisionMatrix: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true,
			antialias: true,
		});

		/**************** Scene Setup ****************/
		scene = new BABYLON.Scene(engine);

		onSceneLoaded();
		window.scene = scene;

		scene.whenReadyAsync().then(() => {
			engine.runRenderLoop(() => {
				scene.render();
			});
		});
		/**************** Scene Setup ****************/
	};

	window.addEventListener("resize", () => {
		engine.resize();
	});

	/**************** Scene Setup ****************/
	const onSceneLoaded = async () => {
		await setupCamera(scene);
	//	setupLights(scene);
		player = await SetupEnviornment(scene);

		//new InputHandler(canvasEl, player.rootNodes[0]);
		DebugUI(scene);
	};
	/**************** Scene Setup ****************/

	//const setupLights = (scene) => {
	//	scene.createDefaultLight();
	//};

	const setupCamera = async (scene) => {
		let camera = new BABYLON.ArcRotateCamera(
			"camera",
			1.57,
			1.4,
			8,
			new BABYLON.Vector3(0, 5, 10),
			scene
		);
		camera.inputs.remove(camera.inputs.attached.mousewheel);
		camera.lowerBetaLimit = 0.75;
		camera.upperBetaLimit = 1.7;

		const defaultXRExperience = await scene.createDefaultXRExperienceAsync({
			uiOptions: {
				sessionMode: 'immersive-ar',
				referenceSpaceType: 'local-floor', 
				//sessionCreationOptions:{ requiredFeatures: ['hit-test'], }
			},
			pointerSelectionOptions: {
				enablePointerSelectionOnAllControllers: true
			}
		});

		const xrInput = defaultXRExperience.input;

		//defaultXRExperience.baseExperience.featuresManager.enableFeature(
        //    BABYLON.WebXRFeatureName.POINTER_SELECTION,
        //    'stable',
        //    {
        //        xrInput: xrInput,
        //        enablePointerSelectionOnAllControllers: true
        //    }
        //);
	
		const le = defaultXRExperience.baseExperience.featuresManager.enableFeature(
			BABYLON.WebXRFeatureName.LIGHT_ESTIMATION, 
			'latest', 
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
		
		// Variables to store touch start and current coordinates
		let startX = 0;
		let isDragging = false;
	
		//Add touch support for rotating the player model
		scene.onPointerObservable.add((pointerInfo) => {
			switch (pointerInfo.type) {
				case BABYLON.PointerEventTypes.POINTERDOWN:
					if (pointerInfo.event.pointerType === 'touch') {
						// Start tracking the touch position
						startX = pointerInfo.event.clientX;
						isDragging = true;
					}
					break;
				case BABYLON.PointerEventTypes.POINTERMOVE:
					if (isDragging && pointerInfo.event.pointerType === 'touch') {
						// Calculate the difference in movement
						const currentX = pointerInfo.event.clientX;
	
						const deltaX = currentX - startX;
	
						const rotationSpeed = 0.005; // Adjust rotation speed
	
						// Apply rotation to the player model based on touch movement
						if (player && player.rootNodes[0]) {
							player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0); // Horizontal rotation
						}
	
						// Update the starting point to the new position
						startX = currentX;
					}
					break;
				case BABYLON.PointerEventTypes.POINTERUP:
					// Stop dragging when touch ends
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
					if (defaultXRExperience.baseExperience.state === BABYLON.WebXRState.IN_XR) {
						const controller = defaultXRExperience.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
						if (controller) {
							const globalViewport = defaultXRExperience.baseExperience.camera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
							const screenCoords = BABYLON.Vector3.Project(controller.pointer.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), globalViewport);
							startX = screenCoords.x;
						}
					}
					break;
				case BABYLON.PointerEventTypes.POINTERMOVE:
					console.log('POINTER MOVE');
					if (defaultXRExperience.baseExperience.state === BABYLON.WebXRState.IN_XR) {
						const controller = defaultXRExperience.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId);
						if (controller) {
							const globalViewport = defaultXRExperience.baseExperience.camera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight());
							const screenCoords = BABYLON.Vector3.Project(controller.pointer.position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), globalViewport);
							console.log(screenCoords);
							const currentX = screenCoords.x;
		
							const deltaX = currentX - startX;
		
							const rotationSpeed = 0.005; // Adjust rotation speed
		
							// Apply rotation to the player model based on touch movement
							if (player && player.rootNodes[0]) {
								player.rootNodes[0].addRotation(0, deltaX * rotationSpeed, 0); // Horizontal rotation
							}
		
							// Update the starting point to the new position
							startX = currentX;
						}
					};
					break;
				default:
					console.log('DEFAULT TYPE...?');
					break;
			}
		});
	};

	return (
		<div>
			<canvas
				id="renderCanvas"
				touch-action="none"
				onContextMenu={(evt) => evt.preventDefault()}
			></canvas>
		</div>
	);
};
