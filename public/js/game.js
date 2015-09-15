console.log("APP.JS")
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
////DOM SETUP
var renderer = new THREE.WebGLRenderer();
var display = document.getElementById('game-display');
var displayStyle = window.getComputedStyle(display);
var displayWidth = parseInt(displayStyle.width);
var displayHeight = parseInt(displayStyle.width)/1.78;
renderer.setSize( displayWidth, displayHeight);
display.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );   
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	var displayWidth = parseInt(displayStyle.width);
	var displayHeight = parseInt(displayStyle.width)/2;
	renderer.setSize( displayWidth, displayHeight );
}


////GEOMETRY
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};

render();


