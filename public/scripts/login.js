let userTag = document.querySelector(".tag");

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
}
  
  // generateId :: Integer -> String
  function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}
  

  
let id = generateId(8);
userTag.value = `@${id}`
  // "c1a050a4cd1556948d41"

let userpass = document.querySelector(".password-input");

var up;

let hideshowDiv = document.querySelector(".hide-show");
let hideshow = document.querySelector("#hide-show");
let hidden = false;
hideshowDiv.addEventListener('click', function () {
    if (hidden == false) {
        hidden = true;
        hideshow.src = '../src/img/show-password.png';
        up = userpass.value;
        userpass.value = '*'.repeat(up.length)

    }

    else if (hidden == true) {
        hidden = false;
        hideshow.src = '../src/img/hide-password.png';
        userpass.value = up;
        up = '';
    }
});


