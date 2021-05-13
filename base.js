let pageCount = 1; //Global variable that keeps track on what page that should be presented
let dataImage; //Choosed to make this global so that i can use the data in more than one scope.

async function loadImages(param) { //This is the method that loads in the images and adds them to the unordered list.

    if (param === 1) {
        pageCount = 1;
    }
    let userInput = document.getElementById("userInput").value; //Reads the userinput
    let searchURL = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=e04f720cde3ca0c6ee7e5bf41bd42389&text=${userInput}&per_page=20&page=${pageCount}&format=json&nojsoncallback=1&sort=relevance`;
    let fetchImage = await fetch(searchURL);
    dataImage = await fetchImage.json();
    let images = document.getElementById("allImg");
    while(images.firstChild) images.removeChild(images.firstChild); //Removes current images before adding new ones.
    for (let elem of dataImage.photos.photo) { //This for-loop adds all the images to the list and sets their source while also adding the onclick for my lightbox to every img.
        let img = document.createElement("img");
        img.src = await imageURL(elem);
        img.id = elem.id;
        img.onclick = function() {lightBox(elem);} //Adds the onclick for the lightbox and sends a param with the img-data.
        images.append(img);
    }
    loadedPagesAndPhotos(); //Function that presents searchresult
    currentPage();//Function that presents the current page.
}

async function imageURLLightBox(param) {

   return `https://farm${param.farm}.staticflickr.com/${param.server}/${param.id}_${param.secret}_z.jpg` //This is the img URL for my lightbox
}

async function imageURL(param) {

    return `https://farm${param.farm}.staticflickr.com/${param.server}/${param.id}_${param.secret}_q.jpg` //This is the regular img URL.
}

async function nextPage() { //Simple function that goes to next page.

    if (pageCount < totalPages()) {
        pageCount++;
        loadImages(pageCount);
    }
    else {
        alert("You have reached the last page.")
    }
}
async function previousPage() { //Simple function that goes to previous page.
    if (pageCount > 1) {
        pageCount--;
        loadImages(pageCount);
    }
    else {
        alert("You are at page 1.")
    }
}

function loadedPagesAndPhotos() { //Choosed to make this a function to present info for the user in the HTML.
    let totalLoaded = document.getElementById("totload");
    while(totalLoaded.firstChild) totalLoaded.removeChild(totalLoaded.firstChild);
    totalLoaded.append(`Searchresult: ${totalPhotos()} photos.`)
}

function currentPage() { //Same here. Only for showing info to the user in the HTML.
    let currPage = document.getElementById("htmlpages");
    while(currPage.firstChild) currPage.removeChild(currPage.firstChild);
    currPage.append(`Page: ${pageCount} / ${totalPages()}`);
}

function totalPages() { //For info to the HTML.
    return dataImage.photos.pages;
}

function totalPhotos() { //For info to the HTML.
    return dataImage.photos.total;
}

async function lightBox(param) { //This is my lightbox function that is added to every img as a onclick.

    lightbox.classList.add('active') //Activates the "Sleeping" lightbox
    let lightBoximg = document.createElement('img')
    lightBoximg.src = await imageURLLightBox(param)
    while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild) //Clears the lightbox before adding a new img.
    }
    lightbox.appendChild(lightBoximg)
    
    lightbox.addEventListener('click', e => { // And finally adding a eventlistener that removes that active class so that the lightbox "sleeps" again.
        if (e.target !== e.currentTarget) return // A return here so that you have to click outside of the img to close the lightbox.
        lightbox.classList.remove('active')
    })
}