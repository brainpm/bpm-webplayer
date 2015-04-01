var EventEmitter = require('events').EventEmitter;
window.events = new EventEmitter();

var history = require('./history')('.sidebar .history ul');
var topbar = require('./topbar')('.topbar');
var discover = require('./discover');
var feedback = require('./feedback');
var getMenuHTML = require('./lib/menu').getMenuHTML;

var getEpisodeURL = require('./urls').getEpisodeURL;
var appendScriptTag = require('./jsonp');

var TOC = {};
var TRACKS = process.env.tracks.split(':');
console.log('tracks', TRACKS);


window.events.once('end_episode_discovery', function(toc) {
    TOC = toc;
    console.log('episode discovery done.');
    window.events.on('append_episode', function(track, pkg, html) {
        console.log('appending episode');
        var container = document.querySelector('.content');

        var div = document.createElement('div');
        div.classList.add('episode');
        div.setAttribute('name', pkg.name);
        div.innerHTML = html;
        container.appendChild(div);
        feedback(div, function(r) {
            history.appendEpisode(toc[pkg.name]);
            var menuHTML = getMenuHTML(toc, [], [], TRACKS, 4); 
            //console.log(menuHTML);
            div.innerHTML += menuHTML;
        });
    });
    loadAndAppendEpisode('intro');
    loadAndAppendEpisode('tty');
    loadAndAppendEpisode('terminal-emulator');
});

window.events.on('history_clicked', function(episode) {
    console.log('history click on', episode.pkg.name);
});


function loadAndAppendEpisode(name) {
    var url = getEpisodeURL('shecodes-content', name);
    appendScriptTag(url);
}


