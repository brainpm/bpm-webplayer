module.exports = function(episodeElem, cb) {
    var button =  document.createElement('div');
    button.classList.add('button');
    button.innerHTML = "Nice, let's go!";
    episodeElem.appendChild(button);
    button.addEventListener('click', function() {
        button.parentElement.removeChild(button);
        cb();
    });
};
