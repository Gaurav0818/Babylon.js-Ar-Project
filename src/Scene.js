import React, { useEffect } from "react";
import * as BABYLON from "babylonjs";
import { SpawnModel } from "./LoadMeshes";
import { initUI } from "./UIManager";
import { initCamera } from "./Camera";
import { initXR } from "./XR";
import { handlePlayerInput } from "./PlayerInput";

export let engine;
export let scene;
export let canvasEl;
export let player;
export let xr;
let uiPanel;

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
		xr = await initXR(scene);     			// XR setup modularized
		xr.baseExperience.onStateChangedObservable.add((state)=>
		{
			if(state === BABYLON.WebXRState.IN_XR)
			{
				showSetup();
			}
			else
			{
				hideSetup();
			}
		});

	};

	const hideSetup = async () => 
	{
		if (uiPanel)
		{
			uiPanel.isVisible = false; // Hide uiPanel
		}

		if (player)
		{
			player.rootNodes[0].setEnabled(false); // Hide player mesh
		}
	}

	const showSetup = async () => 
	{
		if (!player)
		{
			player = await SpawnModel(scene); // Load meshes if player doesn't exist
			handlePlayerInput(scene, player, xr); // Input handling modularized
		} 
		else 
		{
			player.rootNodes[0].setEnabled(true); // Show player mesh if already loaded
		}

		if (!uiPanel)
		{
			uiPanel = initUI(scene, xr); // Initialize and store uiPanel if not created yet
		} 
		else 
		{
			uiPanel.isVisible = true; // Show uiPanel if it already exists
		}
	}

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
