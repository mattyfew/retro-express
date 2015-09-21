////REX (SPACESHIP) - ORIGINAL COORDINATES
//function rexShapeData(){
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
//}



////////////////////////////////////////////////////////////////////////////////////////// SUNDAY 8PM

console.log("GAME.JS")

// DEGREE TO RADIAN
Math.radians = function(degrees) {return degrees * Math.PI / 180;};

////GAME STATE
var gameState = "menu";

////CREATE SCENE
var scene = new THREE.Scene();
//var scene = new Physijs.Scene();

////CREATE CLOCK
var clock = new THREE.Clock();

////REQUIRE PHYSI.JS
//Physijs.scripts.worker = '/physijs/physijs_worker.js'
//Physijs.scripts.ammo = '/physijs/examples/js/ammo.js';



////DEFINE KEYPRESS EVENT LISTENERS (X & Y MOTION AND CAMERA CHOOSER)
window.addEventListener('keyup', function(event) { event.preventDefault(); Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { event.preventDefault(); Key.onKeydown(event); }, false);
var Key = {
	_pressed: {},
	shift: 16,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	A: 65,
	W: 87,
	D: 68,
	S: 83,
	one: 49,
	two: 50,
	isDown: function (keyCode) {
		return this._pressed[keyCode];
	},
	onKeydown: function (event) {
		this._pressed[event.keyCode] = true;
	},
	onKeyup: function (event) {
		if (event.keyCode === 16){

			rexMesh.rotation.y = 0;
		}
		delete this._pressed[event.keyCode];

	}
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
scoreDisplay.id = 'score-display'

scoreDisplay.innerHTML = 'SCORE: ' + scoreCounter;
display.appendChild(scoreDisplay);

////DOM SETUP - LOGO
var gameLogo = document.createElement('pre');
gameLogo.id = "game-logo"
gameLogo.innerHTML = '██████╗ ███████╗████████╗██████╗  ██████╗ ███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗\r\n██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝\r\n██████╔╝█████╗     ██║   ██████╔╝██║   ██║█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗\r\n██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║\r\n██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║\r\n╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝';
display.appendChild(gameLogo);

////DOM SETUP - START GAME
var startButton = document.createElement('button');
startButton.id = "start-button"
startButton.innerHTML = 'START GAME';
display.appendChild(startButton);


////DOM SETUP - RESET GAME
var resetButton = document.createElement('button');
resetButton.id = "reset-button"
resetButton.innerHTML = 'RESET GAME';

////DEFINE BUTTON PRESS GAME STATES
startButton.addEventListener('click',function(){gameState = "init"; startButton.remove()})
resetButton.addEventListener('click',function(){gameState = "menu"; resetButton.remove(); display.appendChild(startButton); scene.remove(enemyPivot); cancelAnimationFrame(render)})

////LIGHTS
scene.add(new THREE.AmbientLight(0xCCCCCC));

////CAMERA
var camera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 2500);
camera.position.set(0, 100, 1000);
camera.lookAt(scene.position);

////CAMERA2
var camera2 = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
camera2.position.set(1000, 0, -300);
camera2.rotateY(Math.radians(90));
//camera2.lookAt(scene.position);

////ORBIT CAMERA
var orbitCamera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
orbitCamera.position.set(200, 0, 0);



////ORBIT CONTROLS
orbitControls = new THREE.OrbitControls( orbitCamera, renderer.domElement );
//orbitControls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.25;
orbitControls.minDistance = 300;
orbitControls.maxDistance = 1000;
orbitControls.enableZoom = false;


var cameraSwitcher = "camera"

////FOG
scene.fog = new THREE.FogExp2(0x000000, 0.0005);
renderer.setClearColor(scene.fog.color, 1);

////GEOMETRY
////GRID PLANE
var gridSize = 300000;
var gridStep = 100;
var gridGeometry = new THREE.Geometry();
var gridMaterial = new THREE.LineBasicMaterial({
	color: 0x0000FF
});
for (var i = -gridSize; i <= gridSize; i += gridStep) {
	gridGeometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i));
	gridGeometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i));
	gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize));
	gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize));
}
var gridLine = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
var gridLineSpeed = 32;
gridLine.position.y = -500;
scene.add(gridLine);

var gridLineTop = gridLine.clone();
gridLineTop.position.y = 500;
scene.add(gridLineTop);

////START SPHERE 
var sphereGeometry = new THREE.SphereGeometry(150,50,50)
var sphereColor = Math.floor(Math.random() * 16777215).toString(16);
var sphereMaterial = new THREE.MeshBasicMaterial({color:"#" + sphereColor, wireframe: true, transparent: false, opacity: .3})
var startSphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

////CUBE
var cubeGeometry = new THREE.BoxGeometry(4000, 1100, 300000, 10, 10, 1000);
var cubeMaterial = new THREE.MeshBasicMaterial({
	color: 0x666666,
	wireframe: true
});
var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
var cubeMeshSpeed = 32;
cubeMesh.material.side = THREE.DoubleSide;
//cubeMesh.position.y = -250;
scene.add(cubeMesh);

////REX (SPACESHIP) - CENTERED ON AXIS
var rexPivot = new THREE.Object3D();
scene.add(rexPivot)

var rexShape = new THREE.Shape();
rexShapeData() //GRABS SVG DATA
var rexExtrusion = {
	amount: 4,
	bevelEnabled: false
};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({
	color: 0x00FF00,
	wireframe: true
});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
//var rexMesh = new Physijs.ConvexMesh(rexGeometry, rexMaterial);
var rexDirection = "up";
rexMesh.rotateX(Math.radians(90));
rexPivot.translateZ(100);
rexPivot.add(rexMesh);

///ORBIT CAMERA DEATH
rexPivot.add(orbitCamera)
orbitCamera.lookAt(rexPivot.position);

////ENEMY PIVOT (PARENT CONTROL - USE THIS TO MOVE BLOCKS)
var enemyPivot = new THREE.Object3D();
var enemyPivotSpeed = 50;
var enemyId = 0;
scene.add(enemyPivot)


////CREATE AND DELETE OBSTACLES ON INTERVAL
var enemyCreateInterval = setInterval(createEnemy, 10)
//var enemyDeleteInterval = setInterval(deleteEnemy, 10)

////RENDER
var render = function () {

	requestAnimationFrame(render);

	////GAME STATE SWITCHER
	////GAME STATE --> MENU
	if (gameState === "menu"){
		startMenu()
		rexPivot.rotateY(Math.radians(.9))
		startSphereMesh.rotateY(Math.radians(-.1))

	}

	if (gameState === "init") {
		scene.add(rexPivot)
		rexPivot.rotation.y = 0;
		rexPivot.translate.z = 100;
		rexPivot.add(rexMesh)
		checkForCollision();
		//scene.simulate() //start physics
		var delta = clock.getDelta()
		var time = parseInt(clock.getElapsedTime());
		var newColor = Math.floor(Math.random() * 16777215).toString(16);

		////WORLD TRANSLATION && DIFFICULTY    
		checkDifficulty(time) 
		checkForEnemies()

		////REX WOBBLE AND REX CONTROLS
		shipControls();
		rexWobble();

		////PSYCHEDLEIC MODE	
		//	cubeMesh.material.color.setHex( "0x" + newColor );
		//	rexMesh.material.color.setHex( "0x" + newColor );

		////CAMERA SWITCHER
		cameraSwitch();

		////END INIT STATE
	} else if (gameState === "dead") {
		cameraSwitcher = "orbitCamera"
		cameraSwitch();
		display.appendChild(resetButton);
		//		gameState = "init"
		//cancelAnimationFrame(render);
		//controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

		//		enemyPivot.translateZ(0)
		//		gridLine.translateZ(0);
		//		cubeMesh.translateZ(0);
		//		setTimeout(function () {
		//			gameState = "init", scoreCounter = 0
		//		}, 5000)
	}

};

render();

function startMenu(){
	var startMenuScene = new THREE.Scene()
	startMenuScene.add(startSphereMesh)
	startMenuScene.add(rexPivot)
	rexPivot.position.set(0,0,0)
	rexPivot.add(rexMesh)
	startMenuScene.add(new THREE.AmbientLight(0xCCCCCC));

	var startCamera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 500)
	startCamera.position.set(0,60,100)
	startCamera.lookAt(startMenuScene.position)
	startMenuScene.add(startCamera)

	renderer.render(startMenuScene, startCamera)
}

function restartGame(){
	startMenuScene = null;
	scene = null;
}


////REX WOBBLE
function rexWobble() {
	if (rexDirection === "up") {
		rexPivot.translateY(.05)
		if (rexPivot.position.y > 1) {
			rexDirection = "down"
		}
	} else if (rexDirection === "down") {
		rexPivot.translateY(-.05)
		if (rexPivot.position.y < -1) {
			rexDirection = "up"
		}
	}
}

////REX SVG COORDINATES - CENTERED
function rexShapeData() {
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
	if (Key.isDown(Key.left) || Key.isDown(Key.A)) {
		if (rexPivot.position.x > - 450) {
			rexPivot.translateX(-20), rexMesh.rotateY(Math.radians(.1)), scene.rotateZ(Math.radians(.1))
		}
	}
	if (Key.isDown(Key.right) || Key.isDown(Key.D)) {
		if (rexPivot.position.x < 450) {
			rexPivot.translateX(20), rexMesh.rotateY(Math.radians(-.1)), scene.rotateZ(Math.radians(-.1))
		}
	}
	if (Key.isDown(Key.up) || Key.isDown(Key.W)) {
		if (rexPivot.position.y < 400) {
			rexPivot.translateY(15), scene.translateY(-2.5), rexMesh.rotateX(Math.radians(-.1)), scene.rotateX(Math.radians(-.1))
		}
	}
	if (Key.isDown(Key.down) || Key.isDown(Key.S)) {
		if (rexPivot.position.y > -400) {
			rexPivot.translateY(-15), scene.translateY(2.5), rexMesh.rotateX(Math.radians(.1)), scene.rotateX(Math.radians(.1))
		}
	}
	////SHIFT KEY (VERTICAL MODE)
	if (Key.isDown(Key.shift)){
		rexMesh.rotation.y = Math.radians(90);
	}////SHIFT KEYUP IS IN KEY VARIABLE
}

////CAMERA SWITCHER
function cameraSwitch(){
	if (Key.isDown(Key.one)) {
		cameraSwitcher = "camera"
	}
	if (Key.isDown(Key.two)) {
		cameraSwitcher = "camera2"
	}
	if (cameraSwitcher === "camera") {
		renderer.render(scene, camera);
	} else if (cameraSwitcher === "camera2") {
		renderer.render(scene, camera2);
	} else if (cameraSwitcher === "orbitCamera"){
		renderer.render(scene, orbitCamera);
	} else {
		renderer.render(scene, camera);
	}
}

////ENEMY GENERATION
function createEnemy() {
	if (enemyPivot.children.length <= 99) {

		if (typeof enemyMesh != "undefined") {
			var lastEnemyPosition = enemyMesh.position.z;
			var newEnemyPosition = lastEnemyPosition - 200;
		} else {
			var newEnemyPosition = -1000;
		}

		var enemyColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

		var enemyGeometry = new THREE.BoxGeometry(Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 50) + 50, 2, 2, 2)
		var enemyMaterial = new THREE.MeshBasicMaterial({
			color: enemyColor,
			wireframe: true
		});

		enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
		var enemyBox = new THREE.Box3().setFromObject(enemyMesh);
		var enemyHalfX = enemyBox.max.x
		var enemyHalfY = enemyBox.max.y

		enemyId += 1;
		enemyMesh.name = "enemy" + parseInt(enemyId);

		////PHYSI.JS
		enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
		//		enemyMesh = new Physijs.BoxMesh(enemyGeometry, enemyMaterial);

		var switchNum = Math.floor(Math.random() * 21);
		switch (switchNum) {
			case 0:
				////TOP RIGHT
				enemyMesh.position.set((Math.floor(Math.random() * 500) - enemyHalfX), (Math.floor(Math.random() * 400) - enemyHalfY), newEnemyPosition)
				break;
			case 1:
				////TOP LEFT
				enemyMesh.position.set((Math.floor(Math.random() * -500) + enemyHalfX), (Math.floor(Math.random() * 400) - enemyHalfY ), newEnemyPosition)
				break;
			case 2:
				////BOTTOM LEFT
				enemyMesh.position.set((Math.floor(Math.random() * -500) + enemyHalfX), (Math.floor(Math.random() * -400) + enemyHalfY), newEnemyPosition)
				break;
			case 3:
				////BOTTOM RIGHT
				enemyMesh.position.set((Math.floor(Math.random() * 500) - enemyHalfX), (Math.floor(Math.random() * -400) + enemyHalfY), newEnemyPosition)
				break;
			case 4:
				////CENTER
				enemyMesh.position.set(0, 0, newEnemyPosition)
				break;
			case 5:
				////TOP CENTER
				enemyMesh.position.set(0, 400 - enemyHalfY, newEnemyPosition)
				break;
			case 6:
				////BOTTOM CENTER
				enemyMesh.position.set(0, -400 + enemyHalfY, newEnemyPosition)
				break;
			case 7:
				////LEFT CENTER
				enemyMesh.position.set(-500 + enemyHalfX, 0, newEnemyPosition)
				break;
			case 8:
				////RIGHT CENTER
				enemyMesh.position.set(500 - enemyHalfX, 0, newEnemyPosition)
				break;
			case 9:
				////TOP LEFT
				enemyMesh.position.set(-500 + enemyHalfX, 400 - enemyHalfY, newEnemyPosition)
				break;
			case 10:
				////TOP RIGHT
				enemyMesh.position.set(500 - enemyHalfX, 400 - enemyHalfY, newEnemyPosition)
				break;
			case 11:
				////BOTTOM LEFT
				enemyMesh.position.set(-500 + enemyHalfX, -400 + enemyHalfY, newEnemyPosition)
				break;
			case 12:
				////BOTTOM RIGHT
				enemyMesh.position.set(500 - enemyHalfX, -400 + enemyHalfY, newEnemyPosition)
				break;
			case 13:
				////QUAD 1 BOTTOM LEFT
				enemyMesh.position.set(0 + enemyHalfX, 0 + enemyHalfY, newEnemyPosition)
				break;
			case 14:
				////QUAD 2 BOTTOM RIGHT
				enemyMesh.position.set(0 - enemyHalfX, 0 + enemyHalfY, newEnemyPosition)
				break;
			case 15:
				////QUAD 3 TOP RIGHT
				enemyMesh.position.set(0 - enemyHalfX, 0 - enemyHalfY, newEnemyPosition)
				break;
			case 16:
				////QUAD 4 TOP LEFT
				enemyMesh.position.set(0 + enemyHalfX, 0 - enemyHalfY, newEnemyPosition)
				break;
			case 17:
				////QUAD 1 CENTER
				enemyMesh.position.set(250, 200, newEnemyPosition)
				break;
			case 18:
				////QUAD 2 CENTER
				enemyMesh.position.set(-250, 200, newEnemyPosition)
				break;
			case 19:
				////QUAD 3 CENTER
				enemyMesh.position.set(-250, -200, newEnemyPosition)
				break;
			case 20:
				////QUAD 4 CENTER
				enemyMesh.position.set(250, -200, newEnemyPosition)
				break;
		}
		enemyPivot.add(enemyMesh)
	}
}

////DELETE ENEMY
function deleteEnemy() {
	enemyPivot.remove(enemyPivot.children[0])
}

////CHECK FOR COLLISION
function checkForCollision() {
	for (var i = 0; i < enemyPivot.children.length; i++) {
		var rexPosition = new THREE.Box3().setFromObject(rexMesh)
		var enemyPosition = new THREE.Box3().setFromObject(enemyPivot.children[i])

		if (enemyPosition.isIntersectionBox(rexPosition)) {
			gameState = "dead";
			console.log(gameState);
		}
	}
}
////CHECK DIFFICULTY
function checkDifficulty(time) {
	////WORLD TRANSLATION && DIFFICULTY    
	////***** LEVEL 5 *****
	if(time >= 40.0){
		difficulty = .99
		gridLine.translateZ(gridLineSpeed*difficulty)
		cubeMesh.translateZ(cubeMeshSpeed*difficulty)
		checkForEnemies(difficulty)
		console.log("level 5")
	}
	////***** LEVEL 4 *****
	if(time >= 30.0 && time < 40.0){
		difficulty = .401
		gridLine.translateZ(gridLineSpeed*difficulty)
		cubeMesh.translateZ(cubeMeshSpeed*difficulty)
		checkForEnemies(difficulty)
		console.log("level 4")
	}
	////***** LEVEL 3 *****
	if(time >= 20.0 && time < 30.0){
		difficulty = .333
		gridLine.translateZ(gridLineSpeed*difficulty)
		cubeMesh.translateZ(cubeMeshSpeed*difficulty)
		checkForEnemies(difficulty)
		console.log("level 3")
	}
	////***** LEVEL 2 *****
	if (time >= 10.0 && time < 20.0){
		difficulty = .255
		gridLine.translateZ(gridLineSpeed*difficulty);
		cubeMesh.translateZ(cubeMeshSpeed*difficulty);
		checkForEnemies(difficulty)
		console.log("level 2")
	}
	////***** LEVEL 1 *****
	if(time >= 0.0 && time < 10.0){
		difficulty = .100
		gridLine.translateZ(gridLineSpeed*difficulty);
		cubeMesh.translateZ(cubeMeshSpeed*difficulty);
		checkForEnemies(difficulty)
		console.log("level 1")
	}
}

////CHECK IF ENEMIES EXIST
function checkForEnemies(){
	if (typeof enemyMesh != "undefined") {
		enemyPivot.translateZ(enemyPivotSpeed*difficulty)

		if (enemyPivot.children[0].matrixWorld.elements[14] > 200 && enemyPivot.children[0].material.opacity > 0) {
			enemyPivot.children[0].material.opacity -= .1;
		}
		if (enemyPivot.children[0].matrixWorld.elements[14] > 1200) {
			scoreCounter += 1;
			scoreDisplay.innerHTML = '<h1>SCORE: ' + scoreCounter + '</h1>';
			deleteEnemy()
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
