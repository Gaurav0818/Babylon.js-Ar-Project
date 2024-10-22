import React, { useEffect } from "react";
import * as BABYLON from "babylonjs";
import { SetupEnviornment } from "./LoadMeshes";
import { DebugUI } from "./DebugUI";

export var engine;
var scene;

export const Scene = () => {
	useEffect(() => {
		initEngine();
		return () => {};
	}, []);

	const initEngine = () => {
		let canvasEl = document.getElementById("renderCanvas");
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
		setupCamera(scene);
		setupLights(scene);
		await SetupEnviornment(scene);
		DebugUI(scene);
	};
	/**************** Scene Setup ****************/

	const setupLights = (scene) => {
		scene.createDefaultLight();
	};

	const setupCamera = (scene) => {
		let camera = new BABYLON.ArcRotateCamera(
			"camera",
			1.57,
			1.4,
			8,
			new BABYLON.Vector3(0, 5, 10),
			scene
		);
		camera.inputs.remove(camera.inputs.attached.mousewheel);
		camera.attachControl();
		camera.lowerBetaLimit = 0.75;
		camera.upperBetaLimit = 1.7;
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
