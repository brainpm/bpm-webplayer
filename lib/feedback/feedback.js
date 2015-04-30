module.exports = function(episodeElem, cb) {
    var button =  document.createElement('button');
    // TODO: the button text should come from
    // the episode's pkg.
    button.innerHTML = "Nice, let's go!";
    episodeElem.appendChild(button);
    button.addEventListener('click', function() {
        button.parentElement.removeChild(button);
        cb(null);
    });
};
