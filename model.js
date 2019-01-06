if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
//All variables to be generally used
var camera, controls, scene, renderer, sceneObject, clock;
var objects = [];
var raycaster;
var mouse = new THREE.Vector2();
var overviewhasbeen = false;
var selectedComponent;
var mousehovering = false;

var posLandingPage;
var posOverview;

var landing = true;
var overview = false;
var zoomview = false;


function init() {
    posLandingPage = [0, 18, 3];
    posOverview = [10, 3, 10];
    raycaster = new THREE.Raycaster();
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(posLandingPage[0], posLandingPage[1], posLandingPage[2]);
    
    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 25;
    controls.enablePan = false;
    controls.enabled = false;

    // modelimport
    var stableModel = 'models/v4.2/Galileo.gltf';
    scene = loadModel(stableModel); 

    // lights
    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );
    
    window.addEventListener( 'resize', onWindowResize, false );

    animate();
  
    sceneObject = scene;
}

function showZoomtext(objname){
    document.getElementById("zoomviewtext").style.display = "block";
    for(var k = 0; k< 15; k++)
        document.getElementById("text" + k).style.display = "none";
    if (objname == "Low-gain_antenna")
        document.getElementById("text1").style.display = "block";
    else if(objname =="Descent_probe")
        document.getElementById("text2").style.display = "block";
    else if(objname =="Fuselage")
        document.getElementById("text3").style.display = "block";
    else if(objname =="Energetic-particle_detector")
        document.getElementById("text4").style.display = "block";
    else if(objname =="Magnetometer_sensors001")
        document.getElementById("text5").style.display = "block";
    else if(objname =="Plasma-wave_antenna")
        document.getElementById("text6").style.display = "block";
    else if(objname =="Extreme_ultraviolet_spectrometer")
        document.getElementById("text7").style.display = "block";
    else if(objname =="Radioisotope_thermoelectric_generators")
        document.getElementById("text8").style.display = "block";
    else if(objname =="Thrusters_2")
        document.getElementById("text9").style.display = "block";
    else if(objname =="Dust_counter_(at_rear)")
        document.getElementById("text10").style.display = "block";
    else if(objname =="Star_scanner_(at_rear)")
        document.getElementById("text11").style.display = "block";
    else if(objname =="Scan_platform")
        document.getElementById("text12").style.display = "block";
    else if(objname =="Probe_Relay_Antenna")
        document.getElementById("text13").style.display = "block";
    else if(objname =="Sun_shields_")
        document.getElementById("text14").style.display = "block";
}

function cameraPan(params) {
    for(var y = 0; y < objects.length; y++){
        objects[y].material.transparent = true;
    }
    var to = {
        x: params[0],
        y: params[1],
        z: params[2]
    };
    controls.target = new THREE.Vector3(0, 0, 0);
    var tween = new TWEEN.Tween(camera.position)
        .to(to, params[3])
        .easing(TWEEN.Easing.Linear.None)
        .onStart(function(){
            if (overview){
                controls.maxDistance = 25;
                for(var x = 0; x<objects.length; x++){
                    objects[x].material.opacity = 0.5;
                }
            }
            else
                controls.minDistance = 5;
                for(var x = 0; x<objects.length; x++){
                    if(objects[x] == selectedComponent){
                        objects[x].material.transparent = false;
                        objects[x].material.opacity = 1;
                    }
                    else{
                        objects[x].material.opacity = 0.2;
                    }
                }
            setAnimation(true);
        })
        .onUpdate(function () {
            if(!overview)
                camera.lookAt(new THREE.Vector3(selectedComponent.position));
            else
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .onComplete(function () {
            var item =document.getElementById("hoverbuttons")
            item.className = 'unhidden';
            item.style.display = "block";
            tooltiptinit();
            var item =document.getElementById("HelpButton")
            item.className = 'unhidden';
            var item =document.getElementById("simple-icons")
            item.className = 'unhidden';
            item.style.display = "block";
            if(!overview) {
                camera.lookAt(new THREE.Vector3(selectedComponent.position));
                var div = document.getElementById('Overview');
                $('[id="Overview"]').tooltip('hide');
                if(div != null)
                    div.classList.remove("special");
                zoomview = true;
                controls.minDistance = 5;
                controls.maxDistance = 15;
            }
            else{
                var div = document.getElementById('Overview');
                $('[id="Overview"]').tooltip('show');
                if(div != null)
                    div.classList.add("special");
                controls.minDistance = 10;
                controls.maxDistance = 25;
                document.getElementById("zoomviewtext").style.display = "block";
                document.getElementById("text0").style.display = "block";
            }
            controls.saveState();
            setAnimation(false);
            controls.reset();
        })
        .start();
}

function componentClicked(object){
    overview = false;
    setOverviewButton(true);
    controls.enabled = false;
    //Show Scene with Animation
    
    var objname;
    if(object.parent.type == "Group") {
        object = object.parent;
        objname = object.name;
    } else {
        objname = object.name;
    }
    selectedComponent = object;
    controls.target = object.position;
    var o = 0;
    for(var x = 0; x<objects.length; x++){
        if(objects[x] == object || objects[x].parent == object){
            objects[x].material.transparent = false;
            o++;
            var g = x + 1;
            var y = 'Comp' + g;
            var div = document.getElementById(y);
            $('[id="'+y+'"]').tooltip('hide');
            if(div != null)
                div.classList.add("special");
        }
        else{
            objects[x].material.transparent = true;
            o++;
            var g = x + 1;
            var y = 'Comp' + g;
            var div = document.getElementById(y);
            $('[id="'+y+'"]').tooltip('hide');
            if (div != null)
                div.classList.remove("special");
        }
    }

    var params = [20, 20, 0, 2000];
    switch (selectedComponent.name) {
        case "Low-gain_antenna":
            params[0] = 5.4;
            params[1] = 9.3;
            params[2] = 3.1;
            break;
        case "Descent_probe":
            params[0] = -4;
            params[1] = -5;
            params[2] = 4;
            break;
        case "Fuselage":
            params[0] = 12.4;
            params[1] = 3.2;
            params[2] = -2.2;
            break;
        case "Energetic-particle_detector":
            params[0] = 4.2;
            params[1] = 6;
            params[2] = -3.5;
            break;
        case "Magnetometer_sensors001": 
            params[0] = 12;
            params[1] = 8;
            params[2] = -2;
            break;
        case "Plasma-wave_antenna":
            params[0] = 7.3;
            params[1] = 9.5;
            params[2] = 8.5;
            break;
        case "Extreme_ultraviolet_spectrometer":
            params[0] = -5;
            params[1] = 5;
            params[2] = 0;
            break;
        case "Radioisotope_thermoelectric_generators":
            params[0] = -6.2;
            params[1] = 1.8;
            params[2] = 7.5;
            break;
        case "Thrusters_2":
            params[0] = -6;
            params[1] = 3;
            params[2] = 3.4;
            break;
        case "Dust_counter_(at_rear)":
            params[0] = 5.1;
            params[1] = -0.3;
            params[2] = -8.5;
            break;
        case "Star_scanner_(at_rear)":
            params[0] = 5.5;
            params[1] = 2.7;
            params[2] = -2.2;
            break;
        case "Scan_platform":
            params[0] = -4;
            params[1] = -3;
            params[2] = 5;
            break;
        case "Probe_Relay_Antenna":
            params[0] = 10;
            params[1] = 1.4;
            params[2] = 0.4;
            break;
        case "Sun_shields_":
            params[0] = 7;
            params[1] = 7;
            params[2] = -4;
            break;
        default:
            break;
    }
    cameraPan(params);
    showZoomtext(objname);
}

function setAnimation(trueorfalse){
    //controls.enabled = trueorfalse;
    if(trueorfalse){
        pauseControls(document);
        paused = 1;
    }
    else{
        activateControls(document);
        paused = 0;
        controls.enabled = true;
    }
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        componentClicked(intersects[0].object);
    }

}

function mouseHover (object, sidebar) {
    if (sidebar){

    }
    for(var x = 0; x<objects.length; x++){
        if(objects[x] == object || objects[x].parent == object){
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = true;
                    objects[x].parent.children[k].material.opacity = 0.8
                }
            }
            else {
                objects[x].material.transparent = true;
                objects[x].material.opacity = 0.8
            }
        }
        else if(objects[x] == selectedComponent || objects[x].parent == selectedComponent){
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = false;
                    objects[x].parent.children[k].material.opacity = 1;
                }
            }
            else {
                objects[x].material.transparent = false;
                objects[x].material.opacity = 1;
                var g = x + 1;
                var y = 'Comp' + g;
                var div = document.getElementById(y);
                if(div != null)
                    div.classList.add("special");
            }
        }
        else{
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = true;
                    objects[x].parent.children[k].material.opacity = 0.2;
                }
            }
            else {
                objects[x].material.transparent = true;
                objects[x].material.opacity = 0.2;
            }
        }
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);
    var canvas = document.body.getElementsByTagName('canvas')[0];
    if (intersects.length > 0) {
        //hover mechanic
        canvas.style.cursor = "pointer";
        mouseHover(intersects[0].object, false);
        for(var c = 0; c < objects.length; c++){
            if(intersects[0].object == objects[c] ){
                var g = c + 1;
                var y = 'Comp' + g;
                var div = document.getElementById(y);
                $('[id="'+y+'"]').tooltip('show');
                if(selectedComponent != objects[c])
                    div.classList.add("specialhover");
            }
            else{
                var g = c + 1;
                var y = 'Comp' + g;
                var div = document.getElementById(y);
                $('[id="'+y+'"]').tooltip('hide');
                if(div != null && selectedComponent != objects[c])
                    div.classList.remove("specialhover");
            }
        }
    }
    else if(mousehovering){}
    else {
        var opashouldby = 0.5;
        if (zoomview){
            opashouldby = 0.2;
        }
        canvas.style.cursor = "default";
        var o = 0;
        var c;
        for(var x = 0; x<objects.length; x++){
            if(objects[x] == selectedComponent || objects[x].parent == selectedComponent){
                if(objects[x].parent.type == "Group"){
                    for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                        objects[x].parent.children[k].material.transparent = false;
                        objects[x].parent.children[k].material.opacity = 1;
                        c = x+1;
                    }
                }
                else {
                    objects[x].material.transparent = false;
                    objects[x].material.opacity = 1;
                    c = x+1;
                    var y = 'Comp' + c;
                    $('[id="'+y+'"]').tooltip('hide');
                    var div = document.getElementById(y);
                }
            }
            else{
                objects[x].material.transparent = true;
                objects[x].material.opacity = opashouldby;
                c = x+1;
                var y = 'Comp' + c;
                $('[id="'+y+'"]').tooltip('hide');
                var div = document.getElementById(y);
                if(div != null)
                    div.classList.remove("specialhover");
            }
        }
    }
}

function activateControls(document) {
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function pauseControls(document) {
  document.removeEventListener('mousedown', onDocumentMouseDown, false);
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
}

function loadModel(modelname) {

  var newScene = new THREE.Scene();
  clock = new THREE.Clock();
  newScene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  
  // model
  var loader = new THREE.GLTFLoader();
  loader.load( modelname, function ( gltf ) { //UPLOAD MODEL HERE
    gltf.scene.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.material.transparent = true;
        child.material.opacity = 0.5;
        objects.push(child);
      }
    } );
    newScene.add( gltf.scene );

  }, undefined, function ( e ) {

    console.error( e );

  } );
  return newScene
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    TWEEN.update();

    requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}

function render() {
    renderer.render( scene, camera );
}

//THIS IS PROGRAM START
init();