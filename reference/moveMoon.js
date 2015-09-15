
//initial position
function resetMoon(){
	moonMesh.position.x = 5
	moonMesh.position.x += 5 * (Math.random()-0.5)
	moonMesh.position.y = 2 * (Math.random()-0.5)       
}
resetMoon()

//Animate the moon and handle limits
onRenderFcts.push(function(delta, now){
	// move the moon to the left
	moonMesh.position.x += -1 * delta;
	// make it warp
	if( moonMesh.position.x < -3 )  resetMoon()
		})

onRenderFcts.push(function(delta, now){

	// only if the spaceship is loaded
	if( spaceship === null )    return

	// compute distance between spaceship and the moon
	var distance    = moonMesh.position.distanceTo(spaceship.position)
	if( distance < 0.3 ){
		resetMoon()
	}
})