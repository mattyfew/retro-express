console.log("APP.JS")
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 0);
camera.position.set(0, 50, 400);

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
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	var displayWidth = parseInt(displayStyle.width);
	var displayHeight = parseInt(displayStyle.width) / 2;
	renderer.setSize(displayWidth, displayHeight);
}

////LIGHTS
scene.add(new THREE.AmbientLight(0xCCCCCC));


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
scene.add(gridLine);


////CUBE
var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cubeMesh );

////REX (SPACESHIP) - CENTERED ON AXIS
var rexShape = new THREE.Shape();
rexShapeData()//GRABS SVG DATA
var rexExtrusion = {amount: 4,bevelEnabled: false};
var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00,wireframe: true});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
var rexDirection = "up"
rexMesh.rotation.x = 90;
//rexMesh.position.set = THREE.Geometry.center
scene.add(rexMesh);


////RENDER
var render = function () {
	requestAnimationFrame(render);

	cubeMesh.rotation.x += 0.01;
	cubeMesh.rotation.y += 0.01;
	cubeMesh.rotation.z += 0.01;
	cubeMesh.translateY(.5);
	
	rexMesh.rotation.x += 0.01;
	rexMesh.rotation.z += 0.01;
	
	rexWobble();

	renderer.render(scene, camera);
};

render();

////REX WOBBLE
function rexWobble(){
	if(rexDirection === "up"){
		rexMesh.translateZ(-.05)
		if (rexMesh.position.z > 1){
			rexDirection = "down"
		}
	} else if (rexDirection === "down"){
		rexMesh.translateZ(.05)
		if (rexMesh.position.z < -1){
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

