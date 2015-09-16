console.log("GAME.JS")

////CREATE SCENE
var scene = new THREE.Scene();

////DEFINE KEYPRESS EVENT LISTENERS
////REX X & Y MOTION
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
var Key = {
	_pressed: {},
	left: 37,up: 38,right: 39,down: 40,
	A: 65,W: 87,D: 68,S: 83,
	isDown: function(keyCode) {return this._pressed[keyCode];},
	onKeydown: function(event) {this._pressed[event.keyCode] = true;},
	onKeyup: function(event) {delete this._pressed[event.keyCode];}
};

////DOM SETUP
var renderer = new THREE.WebGLRenderer();
var display = document.getElementById('game-display');
var displayStyle = window.getComputedStyle(display);
var displayWidth = parseInt(displayStyle.width);
var displayHeight = parseInt(displayStyle.width) / 1.78;
renderer.setSize(displayWidth, displayHeight);
display.appendChild(renderer.domElement);

////WINDOW RESIZE LISTENER
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	var displayWidth = parseInt(displayStyle.width);
	var displayHeight = parseInt(displayStyle.width) / 2;
	camera.aspect = displayWidth / displayHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(displayWidth, displayHeight);
}

////LIGHTS
scene.add(new THREE.AmbientLight(0xCCCCCC));

////CAMERA
var camera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 1000);
camera.position.set(0, 0, 300);
camera.lookAt( scene.position );
//camera.lookAt( rexMesh );

////GEOMETRY
////GRID PLANE
var gridSize = 300000;
var gridStep = 30;
var gridGeometry = new THREE.Geometry();
var gridMaterial = new THREE.LineBasicMaterial({color: 'green'});
for (var i = - gridSize; i <= gridSize; i += gridStep){
	gridGeometry.vertices.push(new THREE.Vector3( - gridSize, - 0.04, i ));
	gridGeometry.vertices.push(new THREE.Vector3( gridSize, - 0.04, i ));
	gridGeometry.vertices.push(new THREE.Vector3( i, - 0.04, - gridSize ));
	gridGeometry.vertices.push(new THREE.Vector3( i, - 0.04, gridSize ));
}
var gridLine = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces);
gridLine.position.y = -200;
scene.add(gridLine);

////CUBE
var cubeGeometry = new THREE.BoxGeometry( 50, 50, 5000 );
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true} );
var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cubeMesh );
cubeMesh.material.side = THREE.DoubleSide;

////REX (SPACESHIP) - CENTERED ON AXIS
var rexPivot = new THREE.Object3D();
scene.add( rexPivot )
var rexShape = new THREE.Shape();
rexShapeData()//GRABS SVG DATA
var rexExtrusion = {amount: 4,bevelEnabled: false};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00,wireframe: true});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
var rexDirection = "up";
rexMesh.rotateX(1.5707963268);
rexPivot.translateZ(100);

//var quaternion = new THREE.Quaternion();
//quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
//rexMesh.quaternion.multiplyQuaternions( quaternion, rexMesh.quaternion );

//var q = new THREE.Quaternion();
//q.setFromAxisAngle( axis, angle ); // axis must be normalized, angle in radians
//object.quaternion.multiplyQuaternions( q, object.quaternion );

rexPivot.add(rexMesh);

////RENDER
var render = function () {
	requestAnimationFrame(render);
	
	gridLine.translateZ(-1.5);

	//	cubeMesh.rotation.x += 0.01;
	//	cubeMesh.rotation.y += 0.01;
	//	cubeMesh.rotation.z += 0.01;
	cubeMesh.translateZ(2);

	//rexMesh.translateZ(-1);

	//camera.translateZ(-2);
	
	rexWobble();
	shipControls();
	
	//	var xAxis = new THREE.Vector3(1,0,0);
	//	rotateAroundWorldAxis(rexMesh, xAxis, Math.PI / 180);
	
	renderer.render(scene, camera);
};

render();

////REX WOBBLE
function rexWobble(){
	if(rexDirection === "up"){
		rexPivot.translateY(.05)
		if (rexPivot.position.y > 1){
			rexDirection = "down"
		}
	} else if (rexDirection === "down"){
		rexPivot.translateY(-.05)
		if (rexPivot.position.y < -1){
			rexDirection = "up"
		}	
	}
}

////REX SVG COORDINATES - CENTERED
function rexShapeData(){
	rexShape.moveTo(0, -35);
	rexShape.lineTo(9.3, -17.7);
	rexShape.lineTo(50, 21.8);
	rexShape.lineTo(6.6, 21.8);
	rexShape.lineTo(0, 35);
	rexShape.lineTo(-6.6, 21.8);
	rexShape.lineTo(-50, 21.8);
	rexShape.lineTo(-9.3, -17.7);
}
////REX (SPACESHIP) - ORIGINAL COORDINATES
//rexShape.moveTo(100, 56.8);
//rexShape.lineTo(59.3, 18.7);
//rexShape.lineTo(50, 0);
//rexShape.lineTo(40.7, 18.7);
//rexShape.lineTo(0, 56.8);
//rexShape.lineTo(21.8, 56.8);
//rexShape.lineTo(43.4, 56.8);
//rexShape.lineTo(50, 70);
//rexShape.lineTo(56.6, 56.8);
//rexShape.lineTo(78.2, 56.8);


//// SHIP CONTROLS - TRANSLATES REX ON KEYPRESS
function shipControls() {
	//AWDS KEY CONTROLS
	if (Key.isDown(Key.A)) {rexPivot.translateX(-3)}
	if (Key.isDown(Key.D)) {rexPivot.translateX(3)}
	if (Key.isDown(Key.W)) {rexPivot.translateY(3)}
	if (Key.isDown(Key.S)) {rexPivot.translateY(-3)}
	//ARROW KEY CONTROLS
	if (Key.isDown(Key.left)) {rexPivot.translateX(-3),rexMesh.rotateY(-.003)}
	if (Key.isDown(Key.right)) {rexPivot.translateX(3),rexMesh.rotateY(.003)}
	if (Key.isDown(Key.up)) {rexPivot.translateY(3)}
	if (Key.isDown(Key.down)) {rexPivot.translateY(-3)}
}


// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
	rotObjectMatrix = new THREE.Matrix4();
	rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

	// old code for Three.JS pre r54:
	// object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
	// new code for Three.JS r55+:
	object.matrix.multiply(rotObjectMatrix);

	// old code for Three.js pre r49:
	// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
	// old code for Three.js r50-r58:
	// object.rotation.setEulerFromRotationMatrix(object.matrix);
	// new code for Three.js r59+:
	object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
	rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

	// old code for Three.JS pre r54:
	//  rotWorldMatrix.multiply(object.matrix);
	// new code for Three.JS r55+:
	rotWorldMatrix.multiply(object.matrix);                // pre-multiply

	object.matrix = rotWorldMatrix;

	// old code for Three.js pre r49:
	// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
	// old code for Three.js pre r59:
	// object.rotation.setEulerFromRotationMatrix(object.matrix);
	// code for r59+:
	object.rotation.setFromRotationMatrix(object.matrix);
}