console.log("GAME.JS")

////GAME STATE
var gameState = "init";

////CREATE SCENE
var scene = new Physijs.Scene();

////CREATE CLOCK
var clock = new THREE.Clock();

////REQUIRE PHYSI.JS
Physijs.scripts.worker = '/physijs/physijs_worker.js'
Physijs.scripts.ammo = '/physijs/examples/js/ammo.js';

////DEFINE KEYPRESS EVENT LISTENERS (X & Y MOTION AND CAMERA CHOOSER)
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
var Key = {
	_pressed: {},
	left: 37,up: 38,right: 39,down: 40,
	A: 65,W: 87,D: 68,S: 83,
	one: 49, two: 50,
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

////DOM SETUP - SCORE COUNTER
var scoreCounter = 0;
var scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '2%';
scoreDisplay.style.left = '2%';
scoreDisplay.innerHTML = '<h1>SCORE: ' + scoreCounter + '</h1>' ;
display.appendChild(scoreDisplay);

////LIGHTS
scene.add(new THREE.AmbientLight(0xCCCCCC));

////CAMERA
var camera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
camera.position.set(0, 0, 300);
camera.lookAt( scene.position );

////CAMERA2
var camera2 = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
camera2.position.set(1000, 0, 0);
camera2.rotateY(1.5707963268);
//camera2.lookAt( scene.position );

var cameraSwitcher = "camera"

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
//cubeMesh.position.y = -250;
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
var enemyPivotSpeed = 10;
var enemyId = 0;
scene.add( enemyPivot )

////CREATE AND DELETE OBSTACLES ON INTERVAL
var enemyCreateInterval = setInterval(createEnemy, 10)	
//var enemyDeleteInterval = setInterval(deleteEnemy, 10)

////RENDER
var render = function () {

	requestAnimationFrame(render);

	////GAME STATE SWITCHER
	if (gameState === "init"){
		checkForCollision();
		scene.simulate() //start physics
		var delta = clock.getDelta()
		var time = clock.getElapsedTime()*10;
		var newColor = Math.floor(Math.random()*16777215).toString(16);
		
		////WORLD TRANSLATION
		gridLine.translateZ(gridLineSpeed);
		cubeMesh.translateZ(cubeMeshSpeed);
		
		////PSYCHEDLEIC MODE	
		//	cubeMesh.material.color.setHex( "0x" + newColor );
		//	rexMesh.material.color.setHex( "0x" + newColor );

		////REX WOBBLE AND REX CONTROLS
		rexWobble();
		shipControls();
		
		////CHECK IF ENEMIES EXIST
		if (typeof enemyMesh!= "undefined"){
			enemyPivot.translateZ(enemyPivotSpeed)
			if(enemyPivot.children[0].matrixWorld.elements[14] > 500){
				scoreCounter += 1;
				scoreDisplay.innerHTML = '<h1>SCORE: ' + scoreCounter + '</h1>' ;
				deleteEnemy()
			}
		}
		
		////CAMERA SWITCHER
		if (cameraSwitcher === "camera"){
			renderer.render(scene, camera);
		} else if (cameraSwitcher === "camera2"){
			renderer.render(scene, camera2);
		} else {
			renderer.render(scene, camera);
		}
	} else if (gameState === "dead"){
		enemyPivot.translateZ(0)
		gridLine.translateZ(0);
		cubeMesh.translateZ(0);
	}
	
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
	if (Key.isDown(Key.one)) {cameraSwitcher = "camera"}
	if (Key.isDown(Key.two)) {cameraSwitcher = "camera2"}
}

////ENEMY GENERATION

function createEnemy() {
	if (enemyPivot.children.length <= 99){

		if (typeof enemyMesh != "undefined"){
			var lastEnemyPosition = enemyMesh.position.z;
			var newEnemyPosition = lastEnemyPosition - 200;
		} else {
			var newEnemyPosition = 200;
		}

		var enemyColor = '#'+Math.floor(Math.random()*16777215).toString(16);

		var enemyGeometry = new THREE.BoxGeometry(Math.floor(Math.random() * 45) + 5, Math.floor(Math.random() * 45) + 5, Math.floor(Math.random() * 45) + 5, 2, 2, 2)
		var enemyMaterial = new THREE.MeshBasicMaterial({color: enemyColor,wireframe: true});
		enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);

		enemyId += 1;
		enemyMesh.name = "enemy" + parseInt(enemyId);

		////PHYSI.JS
		enemyMesh = new Physijs.BoxMesh(enemyGeometry, enemyMaterial);
		
		var switchNum = Math.floor(Math.random()*4);
		switch(switchNum){
			case 0:
				////TOP RIGHT
				enemyMesh.position.set((Math.floor(Math.random() * 500)), (Math.floor(Math.random() * 400)), newEnemyPosition)
				break;
			case 1:
				////TOP LEFT
				enemyMesh.position.set((Math.floor(Math.random() * -500)), (Math.floor(Math.random() * 400)), newEnemyPosition)
				break;
			case 2:
				////BOTTOM LEFT
				enemyMesh.position.set((Math.floor(Math.random() * -500)), (Math.floor(Math.random() * -400)), newEnemyPosition)
				break;
			case 3:
				////BOTTOM RIGHT
				enemyMesh.position.set((Math.floor(Math.random() * 51200)), (Math.floor(Math.random() * -400)), newEnemyPosition)
				break;
			default:
				////CENTER
				enemyMesh.position.set(0, 0, newEnemyPosition)
		}
		enemyPivot.add(enemyMesh)
	}
}

////DELETE ENEMY
function deleteEnemy(){
	enemyPivot.remove(enemyPivot.children[0])
}

////CHECK FOR COLLISION
function checkForCollision(){
	for(var i = 0; i < enemyPivot.children.length; i++){
		var rexPosition = new THREE.Box3().setFromObject(rexMesh)
		var enemyPosition = new THREE.Box3().setFromObject(enemyPivot.children[i])

		if (enemyPosition.isIntersectionBox(rexPosition)){
			gameState = "dead";
			console.log(gameState);
		}
	}
}

////WINDOW RESIZE
function onWindowResize() {
	var displayWidth = parseInt(displayStyle.width);
	var displayHeight = parseInt(displayStyle.width) / 2;
	camera.aspect = displayWidth / displayHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(displayWidth, displayHeight);
}
