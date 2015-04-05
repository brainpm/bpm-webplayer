var visited = [];

module.exports = function(selector) {
    var el = document.querySelector(selector);

    var api = {};

    api.appendEpisode = function(episode) {
        var li = document.createElement('li');
        li.setAttribute('title', episode.pkg.description);
        li.innerHTML = episode.pkg.name;
        el.appendChild(li);
        li.addEventListener('click', function() {
            window.events.emit('history_clicked', episode);
        });
        visited.push(episode);
    };

    api.visited = function() {
        return visited;
    };

    return api;
};
