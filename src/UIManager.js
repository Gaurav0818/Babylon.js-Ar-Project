import * as GUI from "babylonjs-gui";
import { playAnimation } from "./AnimationController";
import { engine } from "./Scene";

let scene;
let panel;

export const initUI = (s, xr) => 
{
	scene = s;

	let UI = GUI.AdvancedDynamicTexture.CreateFullscreenUI();

	panel = new GUI.StackPanel();
	panel.width = "300px";
	panel.isVertical = true;
	panel.paddingRight = "10px";
	panel.paddingBottom = "50px";
	panel.paddingLeft = "10px";
	panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	UI.addControl(panel);

	let fps = new GUI.TextBlock("fps" + "fps");
	// fps.text = engine.getFps().toFixed();
	fps.width = "5%";
	fps.height = "5%";
	fps.horizontalAlignment = 0;
	fps.verticalAlignment = 0;
	UI.addControl(fps);
	scene.registerBeforeRender(() => 
	{
		fps.text = "fps: " + engine.getFps().toFixed();
	});

	// Add buttons to play different animations
	addButton("Walk Animation", () => playAnimation("walkAnim"));
	addButton("Run Animation", () => playAnimation("runAnim"));
	addButton("Jump Animation", () => playAnimation("jumpAnim"));
	addButton("Idle Animation", () => playAnimation("idleAnim"));


	if (xr) {
        xr.baseExperience.onStateChangedObservable.add((state) => {
            if (state === BABYLON.WebXRState.IN_XR) {
                UI.scaleTo(screen.width, screen.height); 
            } else {
                UI.scaleTo(screen.width, screen.height);  
            }
        });
    }

	return panel;
};

const addButton = (text, onClick) => 
{
	let button = GUI.Button.CreateSimpleButton(text, text);
	button.width = "150px";
	button.height = "40px";
	button.color = "white";
	button.background = "green";
	button.onPointerUpObservable.add(onClick);

	button.paddingTop = "2px";

	panel.addControl(button);
};
