import * as GUI from "babylonjs-gui";
import { playAnimation } from "./AnimationController";
import { engine } from "./Scene";

let scene;
let panel;

export const initUI = (s) => 
{
	scene = s;

	let UI = GUI.AdvancedDynamicTexture.CreateFullscreenUI();

	panel = new GUI.StackPanel();
	panel.width = "300px";
	panel.isVertical = true;
	panel.paddingRight = "20px";
	panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
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
};

const addButton = (text, onClick) => 
{
	let button = GUI.Button.CreateSimpleButton(text, text);
	button.width = "150px";
	button.height = "40px";
	button.color = "white";
	button.background = "green";
	button.onPointerUpObservable.add(onClick);
	panel.addControl(button);
};
