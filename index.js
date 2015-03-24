var EventEmitter = require('events').EventEmitter;
var history = require('./history')('.sidebar .history');

window.events = new EventEmitter();
window.events.on('append_episode', function(track, meta, html) {
    console.log('track',track);
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

window.events.on('history_clicked', function(meta) {
    console.log('history click on', meta);
});

function loadAndAppendEpisode(name) {
    var url = 'https://shecodes-content.github.io/' + name +'/index.js';

    var script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('lang', 'javascript');
    document.body.appendChild(script);
}

loadAndAppendEpisode('intro');
loadAndAppendEpisode('tty');

//window.events.emit('append_episode', 'black', {name: 'test'}, '<span>Hello World!</span>');
