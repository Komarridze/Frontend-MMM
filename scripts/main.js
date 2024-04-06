let hideshowDiv = document.querySelector(".hide-show")
let hideshow = document.querySelector("#hide-show");
let hidden = false;
hideshowDiv.addEventListener('click', function () {
    if (hidden == false) {
        hidden = true;
        hideshow.src = '../src/img/show-password.png';
    }

    else if (hidden == true) {
        hidden = false;
        hideshow.src = '../src/img/hide-password.png';
    }
});

// hideshowDiv.addEventListener('mouseover', function () {
//     hideshowDiv.style.background = "linear-gradient(to bottom, rgba(255, 255, 255, 0.162) 0% 90%, #F0DE54 90% 100%)"
// })