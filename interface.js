var paused = 1;
var help = false;

//called when hovering over the "back to overview" button, controls the look of the button and the sidebar tooltip
function hoverOverviewButton(trueorfalse, buttonobject){
    if(trueorfalse){
        buttonobject.src = 'images/Close-Icon-Word.png';
        var div = document.getElementById("Overview");
        $('[id="Overview"]').tooltip('show');
        if(div != null)o
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

function hoverHelpButton(trueorfalse, buttonobject){
    if(trueorfalse)
        buttonobject.src = 'images/EXPLAIN-GALILEO2.png';
    else
        buttonobject.src = 'images/Explain-Galileo.png';
}

//called when going from zoomview to overview, controls tooltips, zoomtext and animation endposition
function goToOverview(){
    if (zoomview){
        controls.enabled = false;
        selectedComponent = null;
        var scenemodel;
        for (var i = 0; i< scene.children.length; i++){
            if(scene.children[i].type == "Scene")
                scenemodel = scene.children[i];
        }
        for (var i = 0; i< scenemodel.children.length ; i++) {
            if(scenemodel.children[i].name != "Camera"){
                var y = 'Comp' + i;
                var div = document.getElementById(y);
                $('[id="'+y+'"]').tooltip('hide');
                div.classList.remove("special");
            }
        }
        setOverviewButton(false);
        zoomview = false;
        overview = true;
        
        document.getElementById("text0").style.display = "block";
        document.getElementById("zoomviewtext").style.display = "block";
        for(var k = 1; k< amount; k++)
            document.getElementById("text" + k).style.display = "none";
        var params = [posOverview[0], posOverview[1], posOverview[2], 2000]
        cameraPan(params);
    }
}

//controls wether the "back to overview" button is shown
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

//called when component is clicked in the navbar, translates to model.js and calls componentClicked
function goToComp(i){
    var object;
    for (var k = 0; k< scene.children.length; k++){
        if(scene.children[k].type == "Scene")
            object = scene.children[k].children[i];
    }
    componentClicked(object);
}

//called when going from landing page to overview, hides landing page, unhides overview, and calls initial animation
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
    var params = [posOverview[0], posOverview[1], posOverview[2], 2000];
    cameraPan(params);
}

//Toggles the help-overlay and pauses controls
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
    if (paused == 0) {
        pauseControls(document);
        paused = 1;
    }
    else{
        activateControls(document);
        paused = 0;
    }
    controls.enabled = !controls.enabled;
}

//called when hovering over the navigation bar or close to the left to it and controls the tooltips
function hoverSide(id, over) {
    var y;
    if(id != 0)
        y = 'Comp' + id;
    else
        y = 'Overview';
    if (over){
        mousehovering = true;
        var object;
        if (id != 0){
            for (var k = 0; k< scene.children.length; k++){
                if(scene.children[k].type == "Scene")
                    object = scene.children[k].children[id];
            }
            mouseHover(object);
        }
        var div = document.getElementById(y);
        $('[id="'+y+'"]').tooltip('show');
        if(selectedComponent != objects[id])
            div.classList.add("specialhover");
    }
    else {
        mousehovering = false;
        var div = document.getElementById(y);
        $('[id="'+y+'"]').tooltip('hide');
        if(div != null && selectedComponent != objects[id])
            div.classList.remove("specialhover");
    }
    if (overview || (id==0 && over)){
        y ="Overview";
        var div = document.getElementById(y);
        $('[id="'+y+'"]').tooltip('show');
        if(selectedComponent != objects[id])
            div.classList.add("specialhover");
    }
    else{
        y = "Overview";
        var div = document.getElementById(y);
        $('[id="'+y+'"]').tooltip('hide');
        if(selectedComponent != objects[id])
            div.classList.remove("specialhover");
    }
}

//initialization of tooltips
function tooltiptinit(){
    $('[data-toggle="tooltip"]').tooltip();   
    $('.awesome-tooltip').tooltip({
        placement: 'left'
    });  
    $('.awesome-tooltip-active').tooltip({
        placement: 'left'
    });   
}
