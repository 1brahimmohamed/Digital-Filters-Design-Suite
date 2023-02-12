/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Description: This handles UI & layout logic of the application
 * Author     : Maye Khaled, Mariam Wael & Ibrahim Mohamed
 *
 ************************************************************************************/


/**  ------------------------------------------ Variables Declarations ------------------------------------------ **/

// DOM Elements Declarations
const navItemsUp        = document.querySelectorAll('.navi');
const imgs              = document.querySelectorAll('.child-img')
const item              = document.querySelector(".scroll-images");
const playPauseBtn      = document.getElementById("play-pause-btn")
const playPauseBtnIcon  = document.getElementById("play-pause-icon")

let currentImgIndex = 1;

/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/

// Shapes Side Bar
navItemsUp.forEach(navItemUpper => {

    navItemUpper.addEventListener('click', () => {
        navItemsUp.forEach(navItem => {
            navItem.classList.remove('active');
        });

        navItemUpper.classList.add('active');
    });

});

// toggle drawn shape
document.addEventListener('click', (evt) => {

    // if the target element is navigation element
    if (evt.target.matches('.nevo')) {
        if (evt.target.classList.contains('bx-radio-circle'))
            drawZero = true;
        else if (evt.target.classList.contains('bx-x'))
            drawZero = false;
    }
})

// play pause button toggle
playPauseBtn.addEventListener('click', (evt) => {
    if (playPauseBtnIcon.classList.contains('bx-play-circle')) {
        playPauseBtnIcon.classList.remove('bx-play-circle');
        playPauseBtnIcon.classList.add('bx-pause-circle');
        startInterval()
    } else {
        playPauseBtnIcon.classList.remove('bx-pause-circle');
        playPauseBtnIcon.classList.add('bx-play-circle');
        clearInterval(realtimeSignalInterval)
    }
});


/**  ------------------------------------------------ Functions ------------------------------------------------ **/

/**
 * function to scroll down the images
 * @param {string} pageName
 * @param {object} elmnt
 * @param {string} color
 * @returns {void}
 * **/
const openPage = (pageName, elmnt, color)=> {
    let i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

/**
 * function to set id for images catalog by their names
 * @returns {void}
 * **/
const setIDForImages = () => {
    imgs.forEach((img, index) => {
        let imgName = img.src.replace(/^.*[\\\/]/, '')
        img.setAttribute('id', imgName.slice(0,-4))
    })
}

/**
 * function to scroll Up the images
 * @returns {void}
 * **/

const leftScroll = () => {
    item.scrollBy(-130, 0);
    if (currentImgIndex > 0 && currentImgIndex < imgs.length) {
        imgs[currentImgIndex].classList.remove('img-selected');
        currentImgIndex--;
        imgs[currentImgIndex].classList.add('img-selected');

        allPassValueBox.value = imgs[currentImgIndex].id;
        let complexVal = math.complex(`${imgs[currentImgIndex].id}`);
        getAllPassRequest(complexVal)
    }
}

/**
 * function to scroll down the images
 * @returns {void}
 * **/
const rightScroll = () => {
    item.scrollBy(130, 0);
    if (currentImgIndex < imgs.length - 1 && currentImgIndex >= 0) {
        imgs[currentImgIndex].classList.remove('img-selected');
        currentImgIndex++;
        imgs[currentImgIndex].classList.add('img-selected');

        allPassValueBox.value = imgs[currentImgIndex].id;
        let complexVal = math.complex(`${imgs[currentImgIndex].id}`);
        getAllPassRequest(complexVal)
    }
}

/**
 * function to set event listeners on allpass filters
 * @returns {void}
 * **/
const setEventListenersOnAllPassList = () => {
    let allPassFiltersList = document.querySelectorAll('.allpass')

    allPassFiltersList.forEach(filterDiv => {
        filterDiv.addEventListener('click', () => {
            allPassFiltersList.forEach(filter => {
                filter.classList.remove('selected');
            });

            filterDiv.classList.add('selected');
            selectedAllPassFilter = parseInt(filterDiv.id);
        });

    });
}

/**
 * function to create all-pass filter div
 * @param filterID
 * @param filterValue
 * @returns {void}
 */
const createAllPassFilterDiv = (filterID, filterValue) => {
    let filterDiv = document.createElement("div");
    filterDiv.innerText = `a = ${filterValue}`
    filterDiv.classList.add('allpass');
    filterDiv.id = filterID;
    document.getElementById('all-pass-filters').appendChild(filterDiv);
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("design defaultOpen").click();


