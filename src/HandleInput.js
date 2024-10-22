import * as BABYLON from 'babylonjs';

// InputHandler class to manage pinch and swipe gestures
export class InputHandler {
    constructor(canvas, model) {
        this.canvas = canvas;
        this.model = model;

        // Internal variables to track input states
        this.initialDistance = null; // Pinch distance
        this.scalingFactor = 1; // Model scaling factor
        this.initialTouchPosX = null; // Swipe starting X position
        this.initialRotationY = model.rotation.y; // Initial Y rotation of the model

        // Attach event listeners for touch events
        this.attachInputListeners();
    }

    attachInputListeners() {
        // Handle touch start
        this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this));

        // Handle touch move (pinch/scale or swipe/rotate)
        this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));

        // Handle touch end
        this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
    }

    onTouchStart(event) {
        if (event.touches.length === 2) {
            // Two-finger touch (start pinch)
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.initialDistance = Math.sqrt(dx * dx + dy * dy);
        } else if (event.touches.length === 1) {
            // Single finger touch (start swipe)
            this.initialTouchPosX = event.touches[0].clientX;
        }
    }

    onTouchMove(event) {
        if (event.touches.length === 2 && this.initialDistance !== null) {
            // Handle pinch (scale model)
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the scale factor based on pinch distance change
            const scaleChange = currentDistance / this.initialDistance;
            this.model.scaling = new BABYLON.Vector3(scaleChange, scaleChange, scaleChange);
        } else if (event.touches.length === 1 && this.initialTouchPosX !== null) {
            // Handle swipe (rotate model)
            const deltaX = event.touches[0].clientX - this.initialTouchPosX;

            // Rotate based on swipe movement (Y-axis rotation)
            const rotationSpeed = 0.005; // Rotation sensitivity
            this.model.rotation.y = this.initialRotationY + deltaX * rotationSpeed;
        }
    }

    onTouchEnd(event) {
        if (event.touches.length < 2) {
            // Reset initial distance after pinch ends
            this.initialDistance = null;
        }
        if (event.touches.length === 0) {
            // Reset swipe data when touch ends
            this.initialTouchPosX = null;
            this.initialRotationY = this.model.rotation.y;
        }
    }
}