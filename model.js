if ( WEBGL.isWebGLAvailable() === false ) {

  document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}
var mixer, animationClip, gltfStore;
var camera, controls, scene, renderer, sceneObject, clock, backupScene;
var objects = [];
var animation = [];
var z = 0;
var saveCamera;
var raycaster;
var mouse = new THREE.Vector2();
var overviewhasbeen = false;
var startQ, endQ;
var selectedComponent;
var lokat;
var OpArray = [];
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
    backupScene = new THREE.Scene();
    clock = new THREE.Clock();
    //scene.background = new THREE.TextureLoader().load( "images/spacebackground_temp.jpg" );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    backupScene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    //camera.rotation._x = -0.5 * Math.PI;
    //camera.rotation._y = 0;
    //camera.rotation._z = 0.33 * Math.PI;
    camera.position.set(posLandingPage[0], posLandingPage[1], posLandingPage[2]);
    // controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;

    controls.minDistance = 10;
    controls.maxDistance = 25;

    //controls.maxPolarAngle = Math.PI / 2;

    controls.enablePan = false;

    controls.enabled = false;
    gltfStore = {};

    // model
    var newModel = 'animations/Galileo_animation_landing-page-to-overview.gltf';
    backupScene = loadAnimation(newModel, z);
    z++;
    //newModel = 'models/v3.2/Galileo.gltf';
    var stableModel = 'models/v4.2/Galileo.gltf';
    newModel = 'models/v4.1/Galileo.json';
    scene = loadModel(stableModel);   
    //var test = jsonModel(newModel);
    //  var objectLoader = new THREE.ObjectLoader();
        //objectLoader.load('models/v4.1/Galileo_actual_05.json', function ( obj ) {
        //    console.log("hey");
        //  scene.add( obj );
            //} );
    //scene = jsonModel(newModel);

    // lights
    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( 1, 1, 1 );
    backupScene.add( light );

    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( - 1, - 1, - 1 );
    backupScene.add( light );

    var light = new THREE.AmbientLight( 0x3333 );
    scene.add( light );
    var light = new THREE.AmbientLight( 0x3333 );
    backupScene.add( light );


  //

    
    window.addEventListener( 'resize', onWindowResize, false );

    animate();

    
    //objects.transparent = true;

  
    sceneObject = scene;
    console.log(sceneObject);
    console.log(camera);
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

//function cameraPan(posX, posY, posZ, time, [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r]){
//function cameraPan(posX, posY, posZ, time) {
function cameraPan(params) {
    for(var y = 0; y < objects.length; y++){
        objects[y].material.transparent = true;
        //objects[y].material.opacity = opa[y];
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
            if(!overview) {
                camera.lookAt(new THREE.Vector3(selectedComponent.position));
                var div = document.getElementById('Overview');
                $('[id="Overview"]').tooltip('hide');
                if(div != null)
                    div.classList.remove("special");
                //div.className = '';
                zoomview = true;
                controls.minDistance = 5;
                controls.maxDistance = 15;
            }
            else{
                var div = document.getElementById('Overview');
                $('[id="Overview"]').tooltip('show');
                if(div != null)
                    div.classList.add("special");
                //if(!overview)
                //div.className = 'hoverofcomponent';
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
    lokat = object.position;
    setOverviewButton(true);
    controls.enabled = false;
    //Show Scene with Animation
    
    var scenemodel;
    var objname;
    if(object.parent.type == "Group") {
        object = object.parent;
        objname = object.name;
        scenemodel = object.parent;
    } else {
        objname = object.name;
        scenemodel = object.parent;
    }
    selectedComponent = object;
    controls.target = object.position;
    var o = 0;
    for(var x = 0; x<objects.length; x++){
        if(objects[x] == object || objects[x].parent == object){
            objects[x].material.transparent = false;
            OpArray[x] = 1;
            o++;
            var g = x + 1;
            var y = 'Comp' + g;
            var div = document.getElementById(y);
            $('[id="'+y+'"]').tooltip('hide');
            if(div != null)
                div.classList.add("special");
            //$('[id="'+y+'"]').tooltip('toggle');
        }
        else{
            objects[x].material.transparent = true;
            OpArray[x] = 0.2;
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
            params[0] = 12;
            params[1] = 8;
            params[2] = 2;
            break;
        case "Descent_probe":
            params[0] = 6;
            params[1] = -5;
            params[2] = 0;
            break;
        case "Fuselage":
            params[0] = 8;
            params[1] = 8;
            params[2] = -9;
            break;
        case "Energetic-particle_detector":
            params[0] = 2.5;
            params[1] = 1.7;
            params[2] = -5;
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
            params[0] = 0;
            params[1] = 3;
            params[2] = 8;
            break;
        case "Thrusters_2":
            params[0] = 0;
            params[1] = -3;
            params[2] = 7;
            break;
        case "Dust_counter_(at_rear)":
            params[0] = -2;
            params[1] = -3;
            params[2] = -7;
            break;
        case "Star_scanner_(at_rear)":
            params[0] = 3;
            params[1] = 3;
            params[2] = 5;
            break;
        case "Scan_platform":
            params[0] = -4;
            params[1] = -3;
            params[2] = 5;
            break;
        case "Probe_Relay_Antenna":
            params[0] = -6;
            params[1] = -1.5;
            params[2] = -3;
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
    //console.log(object);
    showZoomtext(objname);
    //$('[id="'+y+'"]').tooltip('toggle');
    OpArray = [];
    // lights
    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( 1, 1, 1 );
    //scene.add( light );

    var light = new THREE.DirectionalLight( 0x95ffff );
    light.position.set( - 1, - 1, - 1 );
    //scene.add( light );

    var light = new THREE.AmbientLight( 0x3333 );
    //scene.add( light );

    
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
    //if(sidebar){
    //    if(object.type == "Group"){
    //        object = object.children[0];
    //    }
    //}
    var o = 0;
    for(var x = 0; x<objects.length; x++){
        if(objects[x] == object || objects[x].parent == object){
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = true;
                    objects[x].parent.children[k].material.opacity = 0.8
                    //OpArray[x] = 0.8;
                    o++;
                }
            }
            else {
                objects[x].material.transparent = true;
                objects[x].material.opacity = 0.8
                //OpArray[x] = 0.8;
                o++;
            }
        }
        else if(objects[x] == selectedComponent || objects[x].parent == selectedComponent){
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = false;
                    objects[x].parent.children[k].material.opacity = 1;
                    //OpArray[x] = 1;
                    o++;
                }
            }
            else {
                objects[x].material.transparent = false;
                objects[x].material.opacity = 1;
                var g = x + 1;
                var y = 'Comp' + g;
                var div = document.getElementById(y);
                //$('[id="'+y+'"]').tooltip('show');
                if(div != null)
                    div.classList.add("special");
                //OpArray[x] = 1;
                o++;
            }
        }
        else{
            if(objects[x].parent.type == "Group"){
                for (var k = 0; k< objects[x].parent.children[k].length ; k++) {
                    objects[x].parent.children[k].material.transparent = true;
                    objects[x].parent.children[k].material.opacity = 0.2;
                    //OpArray[x] = 1;
                    o++;
                }
            }
            else {
                objects[x].material.transparent = true;
                objects[x].material.opacity = 0.2;
                //OpArray[x] = 1;
                o++;
            }
            
            //OpArray[x] = 0.2;
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
                //$('[id="'+y+'"]').tooltip('toggle');
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
                        //OpArray[x] = 1;
                        console.log("TESTESTESTET");
                        o++;
                        c = x+1;
                    }
                }
                else {
                    objects[x].material.transparent = false;
                    objects[x].material.opacity = 1;
                    //OpArray[x] = 1;
                    o++;
                    c = x+1;
                    var y = 'Comp' + c;
                    $('[id="'+y+'"]').tooltip('hide');
                    var div = document.getElementById(y);
                }
            }
            else{
                objects[x].material.transparent = true;
                objects[x].material.opacity = opashouldby;
                //OpArray[x] = 0.5;
                o++;
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

function loadAnimation(modelname, z){
  var newScene = new THREE.Scene();
  clock = new THREE.Clock();
  //scene.background = new THREE.TextureLoader().load( "images/spacebackground_temp.jpg" );
  newScene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  
  // model
  var loader = new THREE.GLTFLoader();
  loader.load( modelname, function ( gltf ) { //UPLOAD MODEL HERE
  gltf.scene.traverse( function ( child ) {
    //if ( child.isMesh ) {
      newScene.add( gltf.scene );
      gltfStore.animations =  gltf.animations;
      gltfStore.ship = gltf.scene.children[2];
      gltfStore.cam =  gltf.cameras[0];

      gltfStore.mixer = new THREE.AnimationMixer(gltf.scene);
      
      gltfStore.mixer.clipAction(gltfStore.animations[0]).clampWhenFinished  = true;
      gltfStore.mixer.clipAction(gltfStore.animations[0]).setLoop(THREE.LoopOnce, 0);
      gltfStore.mixer.clipAction(gltfStore.animations[0]).play();

      gltfStore.mixer.addEventListener('finished',function(e){
          setAnimation(false);
          var item =document.getElementById("hoverbuttons")
          item.className = 'unhidden';
          var item =document.getElementById("HelpButton")
          item.className = 'unhidden';
          //saveCamera = newScene.children[3].children[1];
          //scene.children[3].children[0] = saveCamera;
          overviewhasbeen = true;
          //gltfStore.mixer = null;
      });
     
  } );

  }, undefined, function ( e ) {

    console.error( e );

  } );
  return newScene;
}

function loadModel(modelname) {

  var newScene = new THREE.Scene();
  clock = new THREE.Clock();
  //scene.background = new THREE.TextureLoader().load( "images/spacebackground_temp.jpg" );
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

function jsonModel(modelname) {
    var loader = new THREE.ObjectLoader();

    var newScene = new THREE.Scene();
    clock = new THREE.Clock();
    //scene.background = new THREE.TextureLoader().load( "images/spacebackground_temp.jpg" );
    //newScene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    loader.load(
        // resource URL
        'models/v4.1/Galileo.json',

        // onLoad callback
        // Here the loaded data is assumed to be an object
        function ( obj ) {
            // Add the loaded object to the scene
            scene.add( obj );
        },

        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function ( err ) {
            console.error( 'An error happened' );
        }
    );
    return newScene;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
//controls.autoRotate = true;

function animate() {

    //if (overviewhasbeen)
    TWEEN.update();

    requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}

function render() {
    renderer.render( scene, camera );
}

for (item in objects){
  item.callback = function() { console.log( this.name ); }
  mesh.callback = function() { console.log( this.name ); }
  //child.callback = function() { console.log( this.name ); }

}








//AT START OF PROGRAM
init();