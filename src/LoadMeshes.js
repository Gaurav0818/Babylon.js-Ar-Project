import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { SetAnimKeyMaps } from "./AnimationController";

export let playerAnims;

export const SpawnModel = async (scene) => 
{
	console.log("Env Setup");
	return CreatPlayerContainer(scene);
};

export const CreatPlayerContainer = async (scene) => 
{
	const playerContainer = await BABYLON.SceneLoader.LoadAssetContainerAsync
	(
		"",
		"Models/Avatar.glb",
		scene
	);
	
	const animMesh = await BABYLON.SceneLoader.ImportMeshAsync
	(
		null,
		"Models/Avatar_RIG_V4.glb",
		"",
		scene
	);

	let animGroup = animMesh.animationGroups;

	const playerRoot = playerContainer.instantiateModelsToScene((s) => s, false, 
	{
		doNotInstantiate: true,
	});

	playerRoot.animationGroups.forEach((e) => 
	{
		e.dispose();
	});

	const tempAnimHolder = [];
	animGroup.forEach((element) => 
	{
		if (!element.name.includes("EMOTE"))
			if (!element.name.includes("FEMALE")) 
			{
				tempAnimHolder.push(element);
			}
	});

	playerRoot.rootNodes[0].position.z = 5;
	playerRoot.rootNodes[0].addRotation(0, Math.PI, 0);
	const anims = retargetAnims(playerRoot.rootNodes[0], tempAnimHolder);
	playerRoot.rootNodes[0].animations = anims;
	playerAnims = playerRoot.rootNodes[0].animations;
	playerRoot.rootNodes[0].animations[0].play(true);

	SetAnimKeyMaps();

	return playerRoot;
};

export const retargetAnims = (player, animations) => 
{
	const newAnimations = [];
	animations.forEach((animGroup) => 
	{
		const newAnim = animGroup.clone(animGroup.name, (target) => 
		{
			return player.getChildren((node) => node.name === target.name, false)[0];
		});
		newAnimations.push(newAnim);
	});
	return newAnimations;
};
