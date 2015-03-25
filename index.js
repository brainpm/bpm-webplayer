var EventEmitter = require('events').EventEmitter;
window.events = new EventEmitter();

var history = require('./history')('.sidebar .history');
var topbar = require('./topbar')('.topbar');
var discover = require('./discover');
var getEpisodeURL = require('./urls').getEpisodeURL;
var appendScriptTag = require('./jsonp');

window.events.once('end_episode_discovery', function() {
    window.events.on('append_episode', function(track, meta, html) {
        var container = document.querySelector('.track.' + track);
        if (container === null) {
            container = document.querySelector('.content .intro');
        }

        var div = document.createElement('div');
        div.classList.add('episode');
        div.setAttribute('name', meta.name);
        div.innerHTML = html;
        container.appendChild(div);
        history.appendEpisode(meta);
    });
});

window.events.on('history_clicked', function(meta) {
    console.log('history click on', meta);
});


function loadAndAppendEpisode(name) {
    var url = getEpisodeURL('shecodes-content', name);
    appendScriptTag(url);
}

//loadAndAppendEpisode('intro');
//loadAndAppendEpisode('tty');
//loadAndAppendEpisode('terminal-emulator');

