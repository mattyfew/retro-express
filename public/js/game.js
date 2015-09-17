console.log("GAME.JS")

////CREATE SCENE
var scene = new THREE.Scene();

////CREATE CLOCK
var clock = new THREE.Clock();

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
var camera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
camera.position.set(0, 0, 300);
camera.lookAt( scene.position );

////FOG
scene.fog = new THREE.FogExp2( 0x000000, 0.0005);
renderer.setClearColor( scene.fog.color, 1 );

////GEOMETRY
////GRID PLANE
var gridSize = 300000;
var gridStep = 100;
var gridGeometry = new THREE.Geometry();
var gridMaterial = new THREE.LineBasicMaterial({color: 0x0000FF});
for (var i = - gridSize; i <= gridSize; i += gridStep){
	gridGeometry.vertices.push(new THREE.Vector3( - gridSize, - 0.04, i ));
	gridGeometry.vertices.push(new THREE.Vector3( gridSize, - 0.04, i ));
	gridGeometry.vertices.push(new THREE.Vector3( i, - 0.04, - gridSize ));
	gridGeometry.vertices.push(new THREE.Vector3( i, - 0.04, gridSize ));
}
var gridLine = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces);
gridLine.position.y = -500;
scene.add(gridLine);

////CUBE
var cubeGeometry = new THREE.BoxGeometry( 2000, 1000, 300000,10,10,1000);
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x666666, wireframe: true} );
var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cubeMesh );
cubeMesh.position.y = -250;
cubeMesh.material.side = THREE.DoubleSide;

////REX (SPACESHIP) - CENTERED ON AXIS
var rexPivot = new THREE.Object3D();
scene.add( rexPivot )
var rexShape = new THREE.Shape();
rexShapeData()//GRABS SVG DATA
var rexExtrusion = {amount: 4,bevelEnabled: false};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe:true});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
var rexDirection = "up";
rexMesh.rotateX(1.5707963268);
rexPivot.translateZ(100);
rexPivot.add(rexMesh);

////SET OBSTACLES ON INTERVAL
setInterval(createEnemy, 2000)

////RENDER
var render = function () {
	requestAnimationFrame(render);
	var delta = clock.getDelta()
	var time = clock.getElapsedTime()*10;

	gridLine.translateZ(1.5);

	//cubeMesh.rotation.z += 0.01;
	cubeMesh.translateZ(1.5);
	
	rexWobble();
	shipControls();

	if (typeof enemyMesh!= "undefined"){
		enemyMesh.translateZ(1.5)
	}
	
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
	//ARROW KEY & WASD CONTROLS
	if (Key.isDown(Key.left) || Key.isDown(Key.A)) {if(rexPivot.position.x > -100){rexPivot.translateX(-5),rexMesh.rotateY(.005),scene.rotateZ(.001)}}
	if (Key.isDown(Key.right) || Key.isDown(Key.D)) {if(rexPivot.position.x < 100){rexPivot.translateX(5),rexMesh.rotateY(-.005), scene.rotateZ(-.001)}}
	if (Key.isDown(Key.up) || Key.isDown(Key.W)) {if(rexPivot.position.y < 65){rexPivot.translateY(3.2),rexMesh.rotateX(-.003), scene.rotateX(-.001)}}
	if (Key.isDown(Key.down) || Key.isDown(Key.S)) {if(rexPivot.position.y > -65){rexPivot.translateY(-3.2),rexMesh.rotateX(.003), scene.rotateX(.001)}}
}

////ENEMY GENERATION

function createEnemy() {
	var enemyGeometry = new THREE.BoxGeometry(25, 25, 25)
	var enemyMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00,wireframe: true});
	enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);

	var switchNum = Math.floor(Math.random()*4);
	console.log(switchNum)
	switch(switchNum){
		case 0:
			////TOP RIGHT
			console.log("QUAD1")
			enemyMesh.position.set((Math.floor(Math.random() * 125)), (Math.floor(Math.random() * 75)), 100)
			console.log(enemyMesh.position)
			break;
		case 1:
			////TOP LEFT
			console.log("QUAD2")
			enemyMesh.position.set((Math.floor(Math.random() * -125)), (Math.floor(Math.random() * 75)), 100)
			console.log(enemyMesh.position)
			break;
		case 2:
			////BOTTOM LEFT
			console.log("QUAD3")
			enemyMesh.position.set((Math.floor(Math.random() * -125)), (Math.floor(Math.random() * -75)), 100)
			console.log(enemyMesh.position)
			break;
		case 3:
			////BOTTOM RIGHT
			console.log("QUAD4")
			enemyMesh.position.set((Math.floor(Math.random() * 125)), (Math.floor(Math.random() * -75)), 100)
			console.log(enemyMesh.position)
			break;
	//default:
	////CENTERED
		//enemyMesh.position.set(0, 0, 100)
	}            
	scene.add(enemyMesh)
}