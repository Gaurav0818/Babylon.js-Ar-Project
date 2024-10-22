import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { SetAnimKeyMaps } from "./AnimationController";
import {InputHandler, inputHandler} from "./HandleInput";

export let playerAnims;

export const SetupEnviornment = async (scene) => {
	console.log("Env Setup");
	CreatPlayerContainer(scene);
};

export const SpawnPlayer = async (playerRoot, scene) => {
	console.log(playerRoot);
	playerRoot.position.y = -0.9;

	/**************** Seting up physics player ****************/
	let camTarget = new BABYLON.TransformNode("camTarget", scene);
	camTarget.position = new BABYLON.Vector3(0, 0.7, 0);
	let camera = scene.getCameraByName("camera");
	camera.lockedTarget = camTarget;

	/**************** Seting up physics player ****************/

	console.log("Spawned");
	return playerRoot;
};

export const CreatPlayerContainer = async (scene) => {
	const playerContainer = await BABYLON.SceneLoader.LoadAssetContainerAsync(
		"",
		"Models/Avatar.glb",
		scene
	);
	const animContainer = await BABYLON.SceneLoader.ImportMeshAsync(
		null,
		"Models/Avatar_RIG_V4.glb",
		"",
		scene
	);
	let animGroup = animContainer.animationGroups;

	const playerRoot = playerContainer.instantiateModelsToScene((s) => s, false, {
		doNotInstantiate: true,
	});
	playerRoot.animationGroups.forEach((e) => {
		e.dispose();
	});

	const tempAnimHolder = [];
	animGroup.forEach((element) => {
		if (!element.name.includes("EMOTE"))
			if (!element.name.includes("FEMALE")) {
				tempAnimHolder.push(element);
			}
	});
	const anims = retargetAnims(playerRoot.rootNodes[0], tempAnimHolder);
	playerRoot.rootNodes[0].animations = anims;
	playerAnims = playerRoot.rootNodes[0].animations;
	playerRoot.rootNodes[0].animations[0].play(true);

	SetAnimKeyMaps();

	const player = await SpawnPlayer(playerRoot.rootNodes[0], scene);

	new InputHandler(scene, player);
};
export const retargetAnims = (player, animations) => {
	const newAnimations = [];
	animations.forEach((animGroup) => {
		const newAnim = animGroup.clone(animGroup.name, (target) => {
			return player.getChildren((node) => node.name === target.name, false)[0];
		});
		newAnimations.push(newAnim);
	});
	return newAnimations;
};
