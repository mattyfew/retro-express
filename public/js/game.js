console.log("GAME.JS")

// DEGREE TO RADIAN
Math.radians = function(degrees) {return degrees * Math.PI / 180;};

////DEFINE KEYPRESS EVENT LISTENERS (X & Y MOTION AND CAMERA CHOOSER)
window.addEventListener('keyup', function(event) { event.preventDefault(); Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { event.preventDefault(); Key.onKeydown(event); }, false);
var Key = {
	_pressed: {},
	shift: 16, 
	left: 37, up: 38, right: 39, down: 40,
	A: 65,W: 87,D: 68,S: 83,
	one: 49,two: 50,
	isDown: function (keyCode) {return this._pressed[keyCode];},
	onKeydown: function (event) {this._pressed[event.keyCode] = true;},
	onKeyup: function (event) {if (event.keyCode === 16){rexMesh.rotation.y = 0;}delete this._pressed[event.keyCode];}
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
	console.log("derp")
		var displayWidth = parseInt(displayStyle.width);
		var displayHeight = parseInt(displayStyle.width) / 2;
		if (typeof orbitCamera != "undefined"){
			orbitCamera.aspect = displayWidth / displayHeight;
			orbitCamera.updateProjectionMatrix();
		} else if (typeof gameCamera != "undefined"){
			gameCamera.aspect = displayWidth / displayHeight;
			gameCamera.updateProjectionMatrix();
		} else if (typeof sideCamera != "undefined" ){
			sideCamera.aspect = displayWidth / displayHeight;
			sideCamera.updateProjectionMatrix();
		} else if (typeof startCamera != "undefined"){
			startCamera.aspect = displayWidth / displayHeight;
			startCamera.updateProjectionMatrix();
		}
		renderer.setSize(displayWidth, displayHeight);
	}	

////GEOMETRY
////REX (SPACESHIP) - CENTERED ON AXIS
var rexPivot = new THREE.Object3D();
var rexShape = new THREE.Shape();
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
rexShapeData() //GRABS SVG DATA
var rexExtrusion = {amount: 4, bevelEnabled: false};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
//var rexMesh = new Physijs.ConvexMesh(rexGeometry, rexMaterial);


/////////////////////////////////////////////////////////////////////////////////////      END GLOBAL

////GAME STATE

setGameState("menu")


function startMenu(){
	////CREATE SCENE
	var startMenuScene = new THREE.Scene();
	
	////LIGHTS
	startMenuScene.add(new THREE.AmbientLight(0xCCCCCC));
	
	////START CAMERA
	var startCamera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 500);
	startCamera.position.set(0,60,100);
	startCamera.lookAt(startMenuScene.position);
	//startMenuScene.add(startCamera)
//	onWindowResize();
	
	////START SPHERE 
	var sphereGeometry = new THREE.SphereGeometry(150,50,50);
	var sphereColor = Math.floor(Math.random() * 16777215).toString(16);
	var sphereMaterial = new THREE.MeshBasicMaterial({color:"#" + sphereColor, wireframe: true, transparent: false, opacity: .3})
	var startSphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	startMenuScene.add(startSphereMesh);
	
	////DOM SETUP - START GAME
	var startButton = document.createElement('button');
	startButton.id = "start-button"
	startButton.innerHTML = 'START GAME';
	display.appendChild(startButton);
	startButton.addEventListener('click',function(){setGameState("game"); startMenuScene.remove(); startButton.remove()})
	
	////DOM SETUP - LOGO
	var gameLogo = document.createElement('pre');
	gameLogo.id = "game-logo"
	gameLogo.innerHTML = '██████╗ ███████╗████████╗██████╗  ██████╗ ███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗\r\n██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝\r\n██████╔╝█████╗     ██║   ██████╔╝██║   ██║█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗\r\n██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║\r\n██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║\r\n╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝';
	display.appendChild(gameLogo);
	
	
	rexMesh.rotateX(Math.radians(90));
	rexPivot.add(rexMesh);
	startMenuScene.add(rexPivot);
	
	var startMenuAnimate = function(){
		requestAnimationFrame(startMenuAnimate);
		rexPivot.rotateY(Math.radians(.9));
		startSphereMesh.rotateY(Math.radians(-.1));
		renderer.render(startMenuScene, startCamera);
	};
	startMenuAnimate();
}


function startGame(){
	
	function setRexAlive(boolean){
		switch (boolean){
			case true:
				aliveGameOver(true);
				break;
			case false:
				aliveGameOver(false);
				break;
		}
	}
	
	////CAMERA SWITCHER
	var cameraSwitcher = "gameCamera"
	function cameraSwitch(){
		if (Key.isDown(Key.one)) {
			cameraSwitcher = "gameCamera"
		}
		if (Key.isDown(Key.two)) {
			cameraSwitcher = "sideCamera"
		}
		if (cameraSwitcher === "gameCamera") {
			renderer.render(gameScene, gameCamera);
		} else if (cameraSwitcher === "sideCamera") {
			renderer.render(gameScene, sideCamera);
		} else if (cameraSwitcher === "orbitCamera"){
			renderer.render(gameScene, orbitCamera);
		} else {
			renderer.render(gameScene, gameCamera);
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
	////CHECK FOR COLLISION
	function checkForCollision() {
		for (var i = 0; i < enemyPivot.children.length; i++) {
			var rexPosition = new THREE.Box3().setFromObject(rexMesh)
			var enemyPosition = new THREE.Box3().setFromObject(enemyPivot.children[i])

			if (enemyPosition.isIntersectionBox(rexPosition)) {
				setRexAlive(false)
				console.log("You were hit.");
			}
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
				scoreDisplay.innerHTML = 'SCORE: ' + scoreCounter;
				deleteEnemy()
			}
		}
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
	//// SHIP CONTROLS - TRANSLATES REX ON KEYPRESS
	function shipControls() {
		//ARROW KEY & WASD CONTROLS
		if (Key.isDown(Key.left) || Key.isDown(Key.A)) {
			if (rexPivot.position.x > - 450) {
				rexPivot.translateX(-20), rexMesh.rotateY(Math.radians(.1)), gameScene.rotateZ(Math.radians(.1))
			}
		}
		if (Key.isDown(Key.right) || Key.isDown(Key.D)) {
			if (rexPivot.position.x < 450) {
				rexPivot.translateX(20), rexMesh.rotateY(Math.radians(-.1)), gameScene.rotateZ(Math.radians(-.1))
			}
		}
		if (Key.isDown(Key.up) || Key.isDown(Key.W)) {
			if (rexPivot.position.y < 400) {
				rexPivot.translateY(15), gameScene.translateY(-2.5), rexMesh.rotateX(Math.radians(-.1)), gameScene.rotateX(Math.radians(-.1))
			}
		}
		if (Key.isDown(Key.down) || Key.isDown(Key.S)) {
			if (rexPivot.position.y > -400) {
				rexPivot.translateY(-15), gameScene.translateY(2.5), rexMesh.rotateX(Math.radians(.1)), gameScene.rotateX(Math.radians(.1))
			}
		}
		////SHIFT KEY (VERTICAL MODE)
		if (Key.isDown(Key.shift)){
			rexMesh.rotation.y = Math.radians(90);
		}////SHIFT KEYUP IS IN KEY VARIABLE
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
	/////////////////////////////////////////////////////////////////
	

	
	////CREATE SCENE
	var gameScene = new THREE.Scene();//var gameScene = new Physijs.Scene();////PHYSJS VERSION
	
	////LIGHTS
	gameScene.add(new THREE.AmbientLight(0xCCCCCC));
	
	////FOG
	gameScene.fog = new THREE.FogExp2(0x000000, 0.0005);
	renderer.setClearColor(gameScene.fog.color, 1);
	
	////GAME CAMERA (3D)
	var gameCamera = new THREE.PerspectiveCamera(55, displayWidth / displayHeight, 0.1, 2500);
	gameCamera.position.set(0, 100, 1000);
	gameCamera.lookAt(gameScene.position);

	////SIDE CAMERA (2.5D)
	var sideCamera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
	sideCamera.position.set(1000, 0, -300);
	sideCamera.rotateY(Math.radians(90));
	//sideCamera.lookAt(gameScene.position);
	
	////CREATE CLOCK
	var gameClock = new THREE.Clock();
	
	////REQUIRE PHYSI.JS
		//Physijs.scripts.worker = '/physijs/physijs_worker.js';
		//Physijs.scripts.ammo = '/physijs/examples/js/ammo.js';
	
//	onWindowResize();
	
	////DOM SETUP - SCORE COUNTER
	var scoreCounter = 0;
	var scoreDisplay = document.createElement('div');
	scoreDisplay.id = 'score-display'
	scoreDisplay.innerHTML = 'SCORE: ' + scoreCounter;
	display.appendChild(scoreDisplay);
	
	////WORLD GEOMETRY
	////GRID PLANE (BOTTOM)
	var gridSize = 300000;
	var gridStep = 100;
	var gridGeometry = new THREE.Geometry();
	var gridMaterial = new THREE.LineBasicMaterial({color: 0x0000FF});
	for (var i = -gridSize; i <= gridSize; i += gridStep) {
		gridGeometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i));
		gridGeometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i));
		gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize));
		gridGeometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize));
	}
	var gridLine = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
	var gridLineSpeed = 32;
	gridLine.position.y = -500;
	////GRID PLANE (TOP)
	var gridLineTop = gridLine.clone();
	gridLineTop.position.y = 500;
	////CUBE (TUNNEL)
	var cubeGeometry = new THREE.BoxGeometry(4000, 1100, 300000, 10, 10, 1000);
	var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x666666, wireframe: true});
	var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	var cubeMeshSpeed = 32;
	cubeMesh.material.side = THREE.DoubleSide;
	
	////ADD WORLD GEOMETRY
	gameScene.add(cubeMesh);
	gameScene.add(gridLine);
	gameScene.add(gridLineTop);
	
	////ENEMY PIVOT (PARENT CONTROL - USE THIS TO MOVE BLOCKS)
	var enemyPivot = new THREE.Object3D();
	var enemyPivotSpeed = 50;
	var enemyId = 0;

	////ADD REX
	var rexDirection = "up";
	rexMesh.rotateX(Math.radians(90));
	rexPivot.rotateY(Math.radians(0));
	rexPivot.translateZ(100);

//	rexPivot.rotation.y = 0;
//	rexPivot.translate.z = 100;
	gameScene.add(rexPivot)
	rexPivot.add(rexMesh);
	
	gameScene.add(enemyPivot);
	
	////CREATE AND DELETE OBSTACLES ON INTERVAL
	var enemyCreateInterval = setInterval(createEnemy, 10)
	//var enemyDeleteInterval = setInterval(deleteEnemy, 10)
	
	function aliveGameOver(boolean){
		switch(boolean){
			case true:
				function gameAnimate(){
					requestAnimationFrame(gameAnimate);
					//gameScene.simulate() //start physics
					var delta = gameClock.getDelta()
					var time = parseInt(gameClock.getElapsedTime());
					var newColor = Math.floor(Math.random() * 16777215).toString(16);

					////WORLD TRANSLATION && DIFFICULTY    
					checkDifficulty(time) 
					checkForEnemies()
					checkForCollision();
					shipControls();
					rexWobble();
					cameraSwitch();


					////PSYCHEDLEIC MODE	
					//	cubeMesh.material.color.setHex( "0x" + newColor );
					//	rexMesh.material.color.setHex( "0x" + newColor );

				};
				gameAnimate();
				break;
			case false:
				function gameOver(){
					console.log("yoooooooooo")
					////ORBIT CAMERA (DEATH CAM)
					var orbitCamera = new THREE.PerspectiveCamera(45, displayWidth / displayHeight, 0.1, 2500);
					orbitCamera.position.set(200, 0, 0);

					////ORBIT CONTROLS
					var orbitControls = new THREE.OrbitControls( orbitCamera, renderer.domElement );
					//orbitControls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
					orbitControls.enableDamping = true;
					orbitControls.dampingFactor = 0.25;
					orbitControls.minDistance = 300;
					orbitControls.maxDistance = 1000;
					orbitControls.enableZoom = false;

					////DOM SETUP - RESET GAME
					var resetButton = document.createElement('button');
					resetButton.id = "reset-button"
					resetButton.innerHTML = 'RESET GAME';
					display.appendChild(resetButton);

					resetButton.addEventListener('click',function(){
						gameState = "menu"; 
						resetButton.remove(); 
						display.appendChild(startButton); 
						gameScene.remove(enemyPivot); 
						function restartGame(){
							startMenuScene = null;
							gameScene = null;
						}
						restartGame()
						setRexAlive(true)
					})


					///ORBIT CAMERA DEATH
					rexPivot.add(orbitCamera)
					orbitCamera.lookAt(rexPivot.position);

					var gameOverAnimate = function(){
						requestAnimationFrame(gameOverAnimate);
						cameraSwitcher = "orbitCamera"
					}
					}
				gameOver();
				break;	
		}
	}
	setRexAlive(true)
}

function setGameState(gameState){
	switch (gameState){
		case "menu":
			startMenu();
			break;
		case "game":
			startGame();
			console.log("derp?")
			break;
	}
}

////////////////////////////////////////////////////////////////////


////RENDER
var render = function () {
	requestAnimationFrame(render);
	////GAME STATE SWITCHER
	////GAME STATE --> MENU
	if (gameState === "menu"){
	}	
	if (gameState === "init") {
		////END INIT STATE
	} else if (gameState === "dead") {
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
//render();

