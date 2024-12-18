// makes border blink on hover
function startBlinkingBorder(element) {
    element.classList.add("is-blinking");
}

function stopBlinkingBorder(element) {
    element.classList.remove("is-blinking");
}

// changes image on hover
function changeImage(container) {
    var img = container.querySelector('img');
    img.setAttribute('data-original-src', img.src);
    var newSrc = img.src.replace('.jpeg', '.gif');
    img.src = newSrc;
}

function restoreImage(container) {
    var img = container.querySelector('img');
    var originalSrc = img.getAttribute('data-original-src');
    img.src = originalSrc;
}