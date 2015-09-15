console.log("APP.JS")
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 0);
////DOM SETUP
var renderer = new THREE.WebGLRenderer();
var display = document.getElementById('game-display');
var displayStyle = window.getComputedStyle(display);
var displayWidth = parseInt(displayStyle.width);
var displayHeight = parseInt(displayStyle.width) / 1.78;
renderer.setSize(displayWidth, displayHeight);
display.appendChild(renderer.domElement);

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

////SHAPES
////REX (SPACESHIP) - CENTERED ON AXIS
var rexShape = new THREE.Shape();
rexShape.moveTo(0, -35);
rexShape.lineTo(9.3, -17.7);
rexShape.lineTo(50, 21.8);
rexShape.lineTo(6.6, 21.8);
rexShape.lineTo(0, 35);
rexShape.lineTo(-6.6, 21.8);
rexShape.lineTo(-50, 21.8);
rexShape.lineTo(-9.3, -17.7);
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


//EXTRUTION FUNCTIONS
var rexExtrusion = {
	amount: 5,
	bevelEnabled: false
};



////GEOMETRY
//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


var rexGeometry = new THREE.ExtrudeGeometry(rexShape, rexExtrusion);
var rexMaterial = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
var rexMesh = new THREE.Mesh(rexGeometry, rexMaterial);
rexMesh.rotation.x = 90;
//rexMesh.position.set = THREE.Geometry.center



scene.add(rexMesh);


camera.position.z = 100;

var render = function () {
	requestAnimationFrame(render);

	//	cube.rotation.x += 0.1;
	//	cube.rotation.y += 0.1;

	//	rexMesh.rotation.x += 0.01;
	rexMesh.rotation.z += 0.01;

	renderer.render(scene, camera);
};

render();
