var EventEmitter = require('events').EventEmitter;
window.events = new EventEmitter();

var history = require('./lib/history')('.sidebar .history ul');
var topbar = require('./lib/topbar')('.topbar');
var discover = require('./lib/discover');
var episode = require('./lib/episode');
var getMenuHTML = require('./lib/menu').getMenuHTML;

var Spinner = require('spin');

var TOC = {};
var TRACKS = process.env.tracks.split(':');

window.events.once('end_episode_discovery', function(toc) {
    TOC = toc;
    console.log('episode discovery done.');
    loadAndAppendEpisode('intro');
    //loadAndAppendEpisode('tty');
    //loadAndAppendEpisode('terminal-emulator');
});

window.events.on('history_clicked', function(episode) {
    console.log('history click on', episode.pkg.name);
});

window.events.on('finished_episode', function(model) {
    history.appendEpisode(model);
    var menuHTML = getMenuHTML(TOC, [], [], TRACKS, 4); 
    var div = document.querySelector('.episode[name='+ model.pkg.name +']');
    div.innerHTML += menuHTML;
});

function loadAndAppendEpisode(name) {
    var container = document.querySelector('.content');
    episode.appendEpisode(container, TOC[name]);
}
