module.exports = function(selector) {
    var el = document.querySelector(selector);
    el.innerHTML = '<span>episodes available:</span><span class="num_episodes"></span><span>last update:</span><span class="last_updated_at"></span>';

    var lastUpdatedElement = el.querySelector('.last_updated_at');
    var numEpisodesElement = el.querySelector('.num_episodes');

    var numEpisodes = 0;
    window.events.on('discovered_episode', function(meta, last_update) {
        numEpisodes++;
        numEpisodesElement.innerHTML = '' + numEpisodes;
        // TODO
        lastUpdatedElement.innerHTML = last_update;
    });
};
