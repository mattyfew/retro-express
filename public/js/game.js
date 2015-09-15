console.log("APP.JS")
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 0 );
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

////LIGHTS
scene.add(new THREE.AmbientLight(0xCCCCCC));

////SHAPES
var rexShape = new THREE.Shape();
rexShape.moveTo(356,258.1);
rexShape.lineTo(315.3,220);
rexShape.lineTo(306,201.3);
rexShape.lineTo(296.7,220);
rexShape.lineTo(256,258.1);
rexShape.lineTo(277.8,258.1);
rexShape.lineTo(299.4,258.1);
rexShape.lineTo(306,271.3);
rexShape.lineTo(312.6,258.1);
rexShape.lineTo(334.2,258.1);

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
var rexMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
var rexMesh = new THREE.Mesh( rexGeometry, rexMaterial );
rexMesh.position.set = THREE.Geometry.center;
scene.add( rexMesh );


camera.position.z = 1000;

var render = function () {
	requestAnimationFrame( render );

//	cube.rotation.x += 0.1;
//	cube.rotation.y += 0.1;
	
	rexMesh.rotation.x += 0.01;
	rexMesh.rotation.y += 0.01;

	renderer.render(scene, camera);
};

render();

