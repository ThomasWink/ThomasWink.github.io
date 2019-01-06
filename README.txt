Welcome to the Galileo Experience

#Made for HCI 2018, LIACS
#Nergis Kuru, s2406802
#Thomas Wink, s1705148

1. Introduction
2. Boot to localhost
3. Customization


1. Introduction
This is a visualization of the Galileo Satelite, where the visualization is meant to be generic and interchangeable with any model. This visualization is made for
the course "HCI & IV" of the CS course Leiden University.

2. Boot to localhost
To run the website on localhost, save all changes. Then open the terminal, go to "../Galileo" and run "live-server". This will open the website.

3. Customization
This webiste is made to be as customizable as possible. To do this, we added comments to make sure that everybody can find the places that need to be changed.
Every comment that is related to Customization has "#CUSTOMIZATION"
To used this with your own model, do the following:
    -upload your model in /models
    -in model.js, search for "stableModel", and set it to your model
    -in model.js, check how many components the model has, and change "amount" to that value plus 1.
    -in model.js, change the whole switch in showzoomtext() and in componentclicked to include your component names
    -in model.js, set the minimal and maximal distance for the controls at the start
    -in index.html, write the correct zoomviewtext
    -in index.html, change the navigationbars to have the correct amount of lines and the titles to be correct
    -in index.html, change the helptext
    -in index.html, change the landingpage text
    -in style.css, add #text as you need them for the zoomviewtexts
    -upload the icons that you want and search in the files for where to replace them