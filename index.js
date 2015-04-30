var _ = require('lodash');

var EventEmitter = require('events').EventEmitter;
window.events = new EventEmitter();

var levelup = require('levelup');
var leveldown = require('level-js');
var sublevel = require('level-sublevel');
var history, logdb;
var db = levelup('brainpm', { db: leveldown }, function() {
    logdb = sublevel(db, 'log');
    history = require('./lib/history')('.sidebar .history ul', logdb);
});

var inventory = require('./lib/inventory')('.sidebar .inventory ul');
var topbar = require('./lib/topbar')('.topbar');
var discover = require('./lib/discover');
var episode = require('./lib/episode');
var appendMenu = require('./lib/menu').appendMenu;
var bpm = require('brainpm');
var Spinner = require('spin');

var scrollToY = function(y) {
    require('scroll-to-y')(y, 1500, 'easeInOutQuint');
};

var Spinner = require('spin');

var TOC = {};
var TRACKS = [];
var TRACK_NAMES = [];

function configure() {
    var tracks = process.env.tracks.split('::');
    console.log(tracks);
    _.forEach(tracks, function(t) {
        TRACKS.push(t.split(':')[0]);
        TRACK_NAMES.push(t.split(':')[1]);
    });
}
configure();

var discoverySpinner = null;
window.events.on('start_episode_discovery', function() {
    discoverySpinner = new Spinner({color:'#111', lines: 12});
    var container = document.querySelector('.container');
    discoverySpinner.spin(container);
});
window.events.on('end_episode_discovery', function() {
    discoverySpinner.stop();
});

window.events.once('end_episode_discovery', function(toc) {
    TOC = toc;
    console.log('episode discovery done.');
    loadAndAppendEpisode('intro');
    //loadAndAppendEpisode('tty');
    //loadAndAppendEpisode('terminal-emulator');
});

function scrollToEpisode(name) {
    var el = document.querySelector('.episode[name=' + name + ']');
    var ypos = el.offsetTop;
    scrollToY(ypos); 
}

window.events.on('history_clicked', function(episode) {
    console.log('history click on', episode.pkg.name);
    scrollToEpisode(episode.pkg.name);
});

function ensureVisible(el) {
    var bounds = el.getBoundingClientRect();
    // if top is negative, we need to scroll down
    // if top + height > viewport.height, we need to scroll up
    // if both is true, we scroll up
    //console.log('ENSURE',el,bounds);
    var clientHeight = document.querySelector('html').clientHeight;
    var deltaBottom = bounds.bottom - clientHeight;
    if (deltaBottom > 0) {
        scrollToY(window.scrollY + deltaBottom);
    } else if (bounds.top < 0) {
        scrollToY(window.scrollY + boundsTop);
    }
}

window.events.on('finished_episode', function(model) {
    logdb.put('finished!'+(new Date()).toISOString(), model.pkg.name + '@' + model.pkg.version, function(err) {
        console.log('PUT', err);
    }); 
    inventory.addKnowledge(model.pkg.brain.provides || []);
    var div = document.querySelector('.episode[name='+ model.pkg.name +']');
    appendMenu(div, TOC, history.visited(), inventory.knowledge(), TRACKS, TRACK_NAMES, 4); 
    ensureVisible(div);
});

window.events.on('episode_chosen', function(e) {
    var model = e.episode;
    console.log('user chose', model.pkg.name);
    // is this a valid option?
    var options = bpm.getOptions(TOC, inventory.knowledge());
    if (_.some(options, function(o) {return o.pkg.name === model.pkg.name;})) {
        e.menu.parentElement.removeChild(e.menu);
        loadAndAppendEpisode(model.pkg.name);
    } else {
       // TODO: display 'you are not ready yet' 
    }
});

function loadAndAppendEpisode(name) {
    var container = document.querySelector('.content');
    episode.appendEpisode(container, TOC[name], function(err) {
        if (err) return;
        history.appendEpisode(TOC[name]);
        scrollToEpisode(name);
    });
}
