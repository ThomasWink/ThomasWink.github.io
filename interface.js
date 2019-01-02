var paused = 1;
var help = false;

function hoverOverviewButton(trueorfalse, buttonobject){
    if(trueorfalse){
        buttonobject.src = 'images/Close-Icon-Word.png';
        var div = document.getElementById("Overview");
        $('[id="Overview"]').tooltip('show');
        if(div != null)
            div.classList.add("special");
    }
    else{
        buttonobject.src = 'images/Close-Icon.png';
        var div = document.getElementById("Overview");
        $('[id="Overview"]').tooltip('hide');
        if(div != null)
            div.classList.remove("special");

    }
}

function goToOverview(){
    var o = 0;
    //for (var i = 0; i < sceneObject.children[3].children.length; i++) {
        //console.log(sceneObject.children[3].children[i].name);
    //}
    if (zoomview){
        controls.enabled = false;
        selectedComponent = null;
        var scenemodel;
        for (var i = 0; i< scene.children.length; i++){
            if(scene.children[i].type == "Scene")
                scenemodel = scene.children[i];
        }
        //controls.target = scenemodel.position;  
        //camera.lookAt(scenemodel.position);
        for (var i = 0; i< scenemodel.children.length ; i++) {
            if(scenemodel.children[i].name != "Camera"){
                if(scenemodel.children[i].type == "Group"){
                    for (var k = 0; k< scenemodel.children[i].children.length ; k++) {
                        //scenemodel.children[i].children[k].material.transparent = true;
                        OpArray[o + k] = 0.9;
                        o++;
                    }
                }
                else {
                    //scenemodel.children[i].material.transparent = true;
                    OpArray[o] = 0.9;
                    o++;
                    var y = 'Comp' + i;
                    var div = document.getElementById(y);
                    $('[id="'+y+'"]').tooltip('hide');
                    div.classList.remove("special");
                }
            }
        }
        setOverviewButton(false);
        zoomview = false;
        overview = true;
        
        document.getElementById("text0").style.display = "block";
        document.getElementById("zoomviewtext").style.display = "block";
        for(var k = 1; k< 15; k++)
            document.getElementById("text" + k).style.display = "none";
        var params = [posOverview[0], posOverview[1], posOverview[2], 2000]
        cameraPan(params);
        OpArray = [];
    }
    else if(overview){
        var div = document.getElementById('Overview');
        $('[id="Overview"]').tooltip('show');
        if(div != null)
            div.classList.add("special");
        document.getElementById("text0").style.display = "block";
        document.getElementById("zoomviewtext").style.display = "block";

    }
}

function setOverviewButton(trueorfalse){
    if(trueorfalse) {
        var item = document.getElementById("overview-button");
        item.style.display = "block";
        item.className = "unhidden";
    }
    else{
        var item = document.getElementById("overview-button");
        item.style.display = "none";
        item.className = "hidden";
    }
}

function goToComp(i){
    var item = document.getElementById("Comp" + i);
    //$("Comp" + 1).tooltip('show');
    //item.className='active';
    var object;
    for (var k = 0; k< scene.children.length; k++){
        if(scene.children[k].type == "Scene")
            object = scene.children[k].children[i];
    }
    componentClicked(object);
}

function LandingToOverview(clickedButton, divID, divID2) {
    var item = document.getElementById(divID);
    if (item) {
        if(item.className=='hidden'){
            item.className = 'unhidden';
            if(clickedButton != null)
                clickedButton.value = 'hide'
        }else{
            item.className = 'hidden';
            if(clickedButton != null)
                clickedButton.value = 'unhide'
        }
    }
    document.getElementById(divID2).style.display = "none";
    //Show Scene with Animation
    landing = false;
    overview = true;
    for (var y = 0; y < objects.length; y++)
        OpArray[y] = objects[y].material.opacity;
    var params = [posOverview[0], posOverview[1], posOverview[2], 2000];
    //cameraPan(posOverview[0], posOverview[1], posOverview[2], 4000);
    cameraPan(params);
    OpArray = [];
    //activating controls reactivated from animation loader
    
    //var item =document.getElementById("mySidenav")
    //item.className = 'unhidden';

}

function landingpageText(divID){
    if(divID == "starttext1"){
        document.getElementById("starttext1").style.display = "none";
        document.getElementById("starttext2").style.display = "block";
    }
    else
    document.getElementById("starttext2").style.display = "none";
}

function ToggleHelp(divID) {
    if (help){
        document.getElementById(divID).style.display = "none";
        help = !help;
        if(overview){
            var div = document.getElementById('Overview');
            $('[id="Overview"]').tooltip('show');
            if(div != null)
                div.classList.add("special");
        }
    }
    else{
        document.getElementById(divID).style.display = "block";
        help = !help;
        if(overview){
            var div = document.getElementById('Overview');
            $('[id="Overview"]').tooltip('hide');
            if(div != null)
                div.classList.remove("special");
        }
    }
    //makes model invisible, not the background
    //sceneObject.visible = !sceneObject.visible;
    
    console.log(camera);
    console.log(camera.position.x+", "+camera.position.y+", "+camera.position.z);
    console.log(camera.rotation._x+", "+camera.rotation._y+", "+camera.rotation._z);
    if (paused == 0) {
        pauseControls(document);
        paused = 1;
    }
    else{
        activateControls(document);
        paused = 0;
    }
    controls.enabled = !controls.enabled;
    //animation

}

function hoverSide(id, over) {
    if (over){
        mousehovering = true;
        var object;
        for (var k = 0; k< scene.children.length; k++){
            if(scene.children[k].type == "Scene")
                object = scene.children[k].children[id];
        }
        mouseHover(object, true);
        var y = 'Comp' + id;
        var div = document.getElementById(y);
        $('[id="'+y+'"]').tooltip('show');
        if(selectedComponent != objects[id])
            div.classList.add("specialhover");
    }
    else {
        console.log("false");
        if(id != -1){
            mousehovering = false;
            var y = 'Comp' + id;
            var div = document.getElementById(y);
            $('[id="'+y+'"]').tooltip('hide');
            if(div != null && selectedComponent != objects[id])
                div.classList.remove("specialhover");
        }
    }
}

function tooltiptinit(){
    $('[data-toggle="tooltip"]').tooltip();   
    $('.awesome-tooltip').tooltip({
        placement: 'left'
    });  
    $('.awesome-tooltip-active').tooltip({
        placement: 'left'
    });   
}
