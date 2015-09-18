console.log("GAME.JS")

////CREATE SCENE
var scene = new Physijs.Scene();

////CREATE CLOCK
var clock = new THREE.Clock();

////REQUIRE PHYSI.JS
Physijs.scripts.worker = '/physijs/physijs_worker.js'
Physijs.scripts.ammo = '/physijs/examples/js/ammo.js';

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
var gridLineSpeed = 32;
gridLine.position.y = -500;
scene.add(gridLine);

////CUBE
var cubeGeometry = new THREE.BoxGeometry( 2000, 1000, 300000,10,10,1000);
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x666666, wireframe: true} );
var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
var cubeMeshSpeed = 32;
cubeMesh.material.side = THREE.DoubleSide;
cubeMesh.position.y = -250;
scene.add( cubeMesh );
////REX (SPACESHIP) - CENTERED ON AXIS
var rexPivot = new THREE.Object3D();
scene.add( rexPivot )
var rexShape = new THREE.Shape();
rexShapeData()//GRABS SVG DATA
var rexExtrusion = {amount: 4,bevelEnabled: false};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true});
var rexMesh = new Physijs.ConvexMesh(rexGeometry, rexMaterial);
var rexDirection = "up";
rexMesh.rotateX(1.5707963268);
rexPivot.translateZ(100);
rexPivot.add(rexMesh);

////ENEMY PIVOT (PARENT CONTROL - USE THIS TO MOVE REX)
var enemyPivot = new THREE.Object3D();
var enemyPivotSpeed = 32;

var enemyId = 0;
scene.add( enemyPivot )

////SET OBSTACLES ON INTERVAL
setInterval(createEnemy, 20)

////DELETE OBSTACLES ON INTERVAL
setInterval(deleteEnemy, 20)

////RENDER
var render = function () {

	requestAnimationFrame(render);
	scene.simulate() //start physics
	var delta = clock.getDelta()
	var time = clock.getElapsedTime()*10;
	var newColor = Math.floor(Math.random()*16777215).toString(16);
	
	////WORLD TRANSLATION
	gridLine.translateZ(gridLineSpeed);
	cubeMesh.translateZ(cubeMeshSpeed);
	
	////PSYCHEDLEIC MODE	
	//cubeMesh.material.color.setHex( "0x" + newColor );
	//rexMesh.material.color.setHex( "0x" + newColor );

	////REX WOBBLE AND REX CONTROLS
	rexWobble();
	shipControls();

	if (typeof enemyMesh!= "undefined"){
		enemyPivot.translateZ(enemyPivotSpeed)
	}
	renderer.render(scene, camera);
	//debugger
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
	if (typeof enemyMesh != "undefined"){
		var lastEnemyPosition = enemyMesh.position.z;
		var newEnemyPosition = lastEnemyPosition - 100;
	}else{
		var newEnemyPosition = 100;
	}
	
	var enemyColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	
	var enemyGeometry = new THREE.BoxGeometry(Math.floor(Math.random() * 45) + 5, Math.floor(Math.random() * 45) + 5, Math.floor(Math.random() * 45) + 5)
	var enemyMaterial = new THREE.MeshBasicMaterial({color: enemyColor,wireframe: true});
	
	//PHYSI.JS
	enemyMesh = new Physijs.BoxMesh(enemyGeometry, enemyMaterial);
	//console.log(linearVelocity)
	enemyMesh.addEventListener('collision', function( rex, linearVelocity, angularVelocity ){
		console.log("linearVelocity: " + linearVelocity)
		console.log("angularVelocity: " + angularVelocity)
		if(rex.name === "rex"){
			alert("COLLISION!!!!!!")
		}
	})

	enemyId += 1;
	enemyMesh.name = "enemy" + parseInt(enemyId);
	
	var switchNum = Math.floor(Math.random()*4);
	switch(switchNum){
		case 0:
			////TOP RIGHT
			enemyMesh.position.set((Math.floor(Math.random() * 200)), (Math.floor(Math.random() * 75)), newEnemyPosition)
			break;
		case 1:
			////TOP LEFT
			enemyMesh.position.set((Math.floor(Math.random() * -200)), (Math.floor(Math.random() * 75)), newEnemyPosition)
			break;
		case 2:
			////BOTTOM LEFT
			enemyMesh.position.set((Math.floor(Math.random() * -200)), (Math.floor(Math.random() * -75)), newEnemyPosition)
			break;
		case 3:
			////BOTTOM RIGHT
			enemyMesh.position.set((Math.floor(Math.random() * 200)), (Math.floor(Math.random() * -75)), newEnemyPosition)
			break;
		default:
			////CENTER
			enemyMesh.position.set(0, 0, newEnemyPosition)
	}
	enemyPivot.add(enemyMesh)
}

////DELETE ENEMY
function deleteEnemy(){
	if (enemyPivot.children.length > 1000){
//		var enemyDepth = enemyPivot.children[0].geometry.parameters.depth
//		console.log(enemyDepth)
//		
//		enemyPivot.remove(enemyPivot.children[0])
//		enemyPivot.position.z += enemyDepth - enemyPivotSpeed
//		console.log(enemyPivot.children[0])
//		console.log(enemyPivot.children.length)
	}
}