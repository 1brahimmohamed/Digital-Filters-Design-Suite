/******************************************************************************
 *
 * File Name  : UI-Handlers.js
 * Type       : Module
 * Description: file to handle UI events
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/

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
            selectedAllPassFilter = filterDiv.id;
        });

    });
}

/**
 * function to create allpass filter div
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

setEventListenersOnAllPassList();
