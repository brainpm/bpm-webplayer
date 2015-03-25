module.exports = function(selector) {
    var el = document.querySelector(selector);

    var api = {};

    api.appendEpisode = function(episode) {
        var li = document.createElement('li');
        li.setAttribute('title', episode.description);
        li.innerHTML = episode.name;
        el.appendChild(li);
        li.addEventListener('click', function() {
            window.events.emit('history_clicked', episode);
        });
    };

    return api;
};
