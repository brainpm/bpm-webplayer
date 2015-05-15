// third-party
var _ = require('lodash');
var Spinner = require('spin');

// third party (db)
var levelup = require('levelup');
var leveldown = require('level-js');
var sublevel = require('level-sublevel');

// helpers


var scrollToY = function(y) {
    require('scroll-to-y')(y, 1500, 'easeInOutQuint');
};

function scrollToEpisode(name) {
    var el = document.querySelector('.episode[name=' + name + ']');
    var ypos = el.offsetTop;
    scrollToY(ypos); 
}

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

function init(config) {
    if (typeof(config) === "undefined") {
        config = {};
    }
    _.defaults(config, {
        tracks: process.env.tracks, 
        github_organisation: process.env.github_organisation
    });
    var EventEmitter = require('events').EventEmitter;
    window.events = new EventEmitter();
    //
    // app-specific modules
    require('discover/discover')(config.github_organisation);
    var episode = require('episode/episode');
    var appendMenu = require('menu/menu').appendMenu;
    var bpm = require('brainpm');
    
    // app-specific UI components
    var topbar = require('topbar/topbar')('.topbar');

    function loadAndAppendEpisode(model) {
        var container = document.querySelector('.content');
        episode.appendEpisode(
            container, model, 
            function(err) {
                if (err) return;
                //history.appendEpisode(model);
                makeEpisodeLogEntry("started_episode", model, function(err) {
                    console.log('PUT', err);
                });
                scrollToEpisode(model.pkg.name);
            }
        );
    }

    var TOC = {};
    var TRACKS = [];
    var TRACK_NAMES = [];
    var history, inventory, logdb;
    var discoverySpinner = null;

    var tracks = config.tracks.split('::');
    console.log(tracks);
    _.forEach(tracks, function(t) {
        TRACKS.push(t.split(':')[0]);
        TRACK_NAMES.push(t.split(':')[1]);
    });

    var db = levelup('brainpm', {
        db: leveldown
    }, function() {
        logdb = sublevel(db, 'log');
        history = require('history/history')(
            '.sidebar .history ul', 
            logdb
        );
        inventory = require('inventory/inventory')(
            '.sidebar .inventory ul',
            logdb
        );
    });
    
    function makeEpisodeLogEntry(action, model, cb) {
        logdb.put(
            (new Date()).toISOString(),
            JSON.stringify({
                action: action,
                pkg: {
                    name: model.pkg.name, 
                    version: model.pkg.version, 
                    description: model.pkg.description,
                    brain: model.pkg.brain
                }
            }),
            cb
        );
    }

    function makeKnowledgeLogEntry(model, cb) {
         var date = (new Date()).toISOString();
         var i = 0;
         var batch = model.pkg.brain.provides.map(function(item) {
            console.log ("added " + item + " to database");
            return {
                type: 'put', 
                key: date+((i++).toString(16)), 
                value: JSON.stringify({
                    action: "knowledge_acquired", 
                    provides: item
                })
            };
         });
        logdb.batch(batch, cb);
    }
    //
    // -- add event listeners
    //
    var e = window.events;

    e.on('start_episode_discovery', function() {
        discoverySpinner = new Spinner({
            color:'#111', 
            lines: 12
        });
        var container = document.querySelector('.container');
        discoverySpinner.spin(container);
    });

    e.on('end_episode_discovery', function() {
        discoverySpinner.stop();
    });

    e.once('end_episode_discovery', function(toc) {
        TOC = toc;
        console.log('episode discovery done.');
        loadAndAppendEpisode(TOC.intro);
    });

    e.on('history_clicked', function(episode) {
        console.log('history click on', episode.pkg.name);
        scrollToEpisode(episode.pkg.name);
    });

    e.on('finished_episode', function(model) {
        makeEpisodeLogEntry("finished_episode", model, function(err) {
            console.log('finished episode log entry', err);
        });
        makeKnowledgeLogEntry(model, function(err) {
            console.log('knowledge log entry written', err);
        });
        var div = document.querySelector(
            '.episode[name='+ model.pkg.name +']'
        );
        appendMenu(
            div, 
            TOC, 
            history.visited(), 
            inventory.knowledge(), 
            TRACKS, TRACK_NAMES, 4
        ); 
        ensureVisible(div);
    });

    e.on('episode_chosen', function(e) {
        var model = e.episode;
        console.log('user chose', model.pkg.name);
        // is this a valid option?
        var options = bpm.getOptions(
            TOC, 
            inventory.knowledge()
        );
        if (_.some(options, function(o) {
            return o.pkg.name === model.pkg.name;
        })) {
            e.menu.parentElement.removeChild(e.menu);
            loadAndAppendEpisode(model);
        } else {
            // TODO: display 'you are not ready yet' 
        }
    });
}
init();


