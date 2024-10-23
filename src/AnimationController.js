import { playerAnims } from "./LoadMeshes";

// Create animation clips for each action
let idleAnim;
let walkAnim;
let runAnim;
let jumpAnim;

let slideAnim;

let currentAnim = 
{
	animName: null,
	anim: null,
	looping: null,
	blending: 0,
};

let animationKeyMap = {}; 

export const SetAnimKeyMaps = () => 
{
	console.log(playerAnims);
	idleAnim = playerAnims[0];
	walkAnim = playerAnims[3];
	runAnim = playerAnims[4];
	jumpAnim = playerAnims[1];
	slideAnim = playerAnims[5];

	animationKeyMap = {
		idleAnim: {
			anim: idleAnim,
			looping: true,
			blending: 0,
			state: 0,
		},
		walkAnim: {
			anim: walkAnim,
			looping: true,
			blending: 0,
			state: 0,
		},
		runAnim: {
			anim: runAnim,
			looping: true,
			blending: 0,
			state: 0,
		},
		jumpAnim: {
			anim: jumpAnim,
			looping: false,
			blending: 0,
			state: 0,
		},
	};
};

export const playAnimation = (anim) => 
{
	if (currentAnim["animName"] != anim || currentAnim["looping"] != true) 
	{
		if (currentAnim["anim"]) 
		{
			currentAnim["anim"].stop();
		}
		
		currentAnim["animName"] = anim;
		currentAnim["anim"] = animationKeyMap[anim]["anim"];
		currentAnim["looping"] = animationKeyMap[anim]["looping"];
		currentAnim["blending"] = animationKeyMap[anim]["blending"];
		animationKeyMap[anim]["anim"].play(animationKeyMap[anim]["looping"]);
		animationKeyMap[anim]["state"] = 1;
	}
};
