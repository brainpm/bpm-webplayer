var template = require('./feedback.jade');

module.exports = function(episodeElem, model, cb) {
    var html = template(model);
    var dummy = document.createElement('div');
    dummy.innerHTML = html;
    var container = dummy.children[0];
    var nextButton = container.querySelector('button.next');
    var cancelButton = container.querySelector('button.cancel');
    episodeElem.appendChild(container);

    nextButton.addEventListener('click', function() {
        container.parentElement.removeChild(container);
        cb(null);
    });
    cancelButton.addEventListener('click', function() {
        container.parentElement.removeChild(container);
        cb(new Error('episode aborted by user'));
    });
};
