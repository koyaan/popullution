// used to store settings changeable through GUI
var Settings = function() {
    this.stepsize = 0.5;
    this.movementMatrix = randomWalkMatrix(this.stepsize);
    this.run = true;
    this.move = false;
    this.collide = false;
    this.animate = true;
    this.cameraPosition = 200;
    this.spawningAreaSize = 8;
    this.maxPop = 20000;
}

// add GUI
var settings = new Settings();
var gui = new dat.GUI();
var stepsizecontroller = gui.add(settings, 'stepsize', 0, 2);

gui.add(settings, 'run');
gui.add(settings, 'move');
gui.add(settings, 'collide');
gui.add(settings, 'animate');

var cameracontroller = gui.add(settings, 'cameraPosition', 0, 1000);

stepsizecontroller.onFinishChange(function(value) {
    settings.movementMatrix = randomWalkMatrix(value);
});

cameracontroller.onFinishChange(function(value) {
    camera.position.z = value;
});

gui.add(settings, 'spawningAreaSize', 1, 50);
gui.add(settings, 'maxPop', 1000, 20000);

function randomWalkMatrix(stepsize) {
    return Array(
        new THREE.Vector3(stepsize  ,0          ,0),
        new THREE.Vector3(-stepsize ,0          ,0),
        new THREE.Vector3(0         ,stepsize   ,0),
        new THREE.Vector3(0         ,-stepsize  ,0),
        new THREE.Vector3(0         ,0          ,stepsize),
        new THREE.Vector3(0         ,0          ,-stepsize)
        );
}