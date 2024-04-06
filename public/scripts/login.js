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