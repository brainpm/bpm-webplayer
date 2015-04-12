var moment = require('moment');

module.exports = function(selector) {
    var el = document.querySelector(selector);
    el.innerHTML = '<i class="spinner fa fa-spinner fa-pulse"></i><span>episodes available:</span><span class="num_episodes"></span><span>last update:</span><span class="last_updated_at"></span>';

    var lastUpdatedElement = el.querySelector('.last_updated_at');
    var numEpisodesElement = el.querySelector('.num_episodes');
    var spinnerElement = el.querySelector('i.spinner');

    var numEpisodes = 0;
    var newestMoment = null;

    window.events.on('end_episode_discovery', function() {
        spinnerElement.style.display = 'none'; 
    }); 

    window.events.on('end_episode_discovery', function() {
        spinnerElement.style.display = 'default'; 
    }); 

    window.events.on('discovered_episode', function(episode, last_update) {
        numEpisodes++;
        numEpisodesElement.innerHTML = '' + numEpisodes;

        var thisMoment = moment(last_update);
        if (newestMoment === null || thisMoment.isAfter(newestMoment))
            newestMoment = thisMoment;
        lastUpdatedElement.innerHTML = newestMoment.fromNow();
    });
};
