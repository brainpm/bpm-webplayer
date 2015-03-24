var EventEmitter = require('events').EventEmitter;

window.events = new EventEmitter();
window.events.on('append_episode', function(track, meta, html) {
    var container = document.querySelector('.track.' + track);
    container = container || document.querySelector('.content');

    var div = document.createElement('div');
    div.classList.add('episode');
    div.setAttribute('name', meta.name);
    div.innerHTML = html;
    container.appendChild(div);
});

function loadAndAppendEpisode(name) {
    var url = 'https://shecodes-content.github.io/' + name +'/index.js';

    var script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('lang', 'javascript');
    document.body.appendChild(script);
}

loadAndAppendEpisode('intro');

//window.events.emit('append_episode', 'black', {name: 'test'}, '<span>Hello World!</span>');
