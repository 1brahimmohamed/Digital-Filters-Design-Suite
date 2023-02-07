/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Description: This handles UI & layout logic of the application
 * Author     : Maye Khaled, Mariam Wael & Ibrahim Mohamed
 *
 ************************************************************************************/



/**  ------------------------------------------ Variables Declarations ------------------------------------------ **/

// DOM Elements Declarations
const navItemsUp = document.querySelectorAll('.navi');
const navItemsDown = document.querySelectorAll('.navo');

// Uniform Phase/Magnitude boolean variables
let uniCanvas1 = false;
let uniCanvas2 = false;


/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/

// Upper Side Bar
navItemsUp.forEach(navItemUpper => {

    navItemUpper.addEventListener('click', () => {
        navItemsUp.forEach(navItem => {
            navItem.classList.remove('active');
        });

        navItemUpper.classList.add('active');
    });

});

// toggle drawn shape & modes
document.addEventListener('click', (evt) => {

    // if the target element is navigation element
    if (evt.target.matches('.nevo')){

        // ------------- Shape Selection ------------- //

        if (evt.target.classList.contains('bx-circle'))
            circleDraw = true;
        else if (evt.target.classList.contains('bx-rectangle'))
            circleDraw = false;

        // ------------- Mode Selection ------------- //

        if (evt.target.classList.contains('bx-merge'))
            mode = modes[0]
        else if (evt.target.classList.contains('bx-intersect'))
            mode = modes[1]
        else if (evt.target.classList.contains('bx-minus-front'))
            mode = modes[2]

        sendRequest()

    }
})

//  disable/enable the canvas


/**  ------------------------------------------------ Functions ------------------------------------------------ **/

function openPage(pageName,elmnt,color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("design defaultOpen").click();