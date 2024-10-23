import React, { useEffect } from "react";
import * as BABYLON from "babylonjs";
import { SetupEnvironment } from "./LoadMeshes";
import { initUI } from "./UIManager";
import { initCamera } from "./Camera";
import { initXR } from "./XR";
import { handlePlayerInput } from "./PlayerInput";

export let engine;
export let scene;
export let canvasEl;
export let player;
export let xr;

export const Scene = () => 
{
	useEffect(() => 
	{
		initEngine();
		return () => 
		{
			engine.dispose(); // Clean up on component unmount
		};
	}, []);

	const initEngine = () => 
	{
		canvasEl = document.getElementById("renderCanvas");
		engine = new BABYLON.Engine
		(
			canvasEl, 
			true, 
			{
				useHighPrecisionMatrix: true,
				premultipliedAlpha: false,
				preserveDrawingBuffer: true,
				antialias: true,
			}
		);

		scene = new BABYLON.Scene(engine);
		window.scene = scene;

		setupScene();

		window.addEventListener("resize", () => 
		{
			engine.resize();
		});

		scene.whenReadyAsync().then(() => 
		{
			engine.runRenderLoop(() => 
			{
				scene.render();
			});
		});
	};

	const setupScene = async () => 
	{
		await initCamera(scene); 				// Camera setup is moved to a separate file
		player = await SetupEnvironment(scene); // Load meshes
		xr = await initXR(scene);     			// XR setup modularized
		handlePlayerInput(scene, player, xr);  	// Input handling modularized
		initUI(scene); 						// UI for debugging
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
