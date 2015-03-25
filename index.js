var EventEmitter = require('events').EventEmitter;
window.events = new EventEmitter();

var history = require('./history')('.sidebar .history ul');
var topbar = require('./topbar')('.topbar');
var discover = require('./discover');
var feedback = require('./feedback');

var getEpisodeURL = require('./urls').getEpisodeURL;
var appendScriptTag = require('./jsonp');

window.events.once('end_episode_discovery', function() {
    console.log('episode discovery done.');
    window.events.on('append_episode', function(track, meta, html) {
        console.log('appending episode');
        var container = document.querySelector('.content');

        var div = document.createElement('div');
        div.classList.add('episode');
        div.setAttribute('name', meta.name);
        div.innerHTML = html;
        container.appendChild(div);
        feedback(div, function(r) {
            history.appendEpisode(meta);
        });
    });
    loadAndAppendEpisode('intro');
});

window.events.on('history_clicked', function(meta) {
    console.log('history click on', meta);
});


function loadAndAppendEpisode(name) {
    var url = getEpisodeURL('shecodes-content', name);
    appendScriptTag(url);
}

//loadAndAppendEpisode('tty');
//loadAndAppendEpisode('terminal-emulator');

