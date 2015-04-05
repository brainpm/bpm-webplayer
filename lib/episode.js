var feedback = require('./feedback');
var getEpisodeURL = require('./urls').getEpisodeURL;
var appendScriptTag = require('./jsonp');
var Spinner = require('spin');

function appendEpisode(container, model) {
    var name = model.pkg.name;

    var div = document.createElement('div');
    div.classList.add('episode');
    div.setAttribute('name', name);
    container.appendChild(div);
    new Spinner({color:'#111', lines: 12}).spin(div);

    var url = getEpisodeURL('shecodes-content', name);
    appendScriptTag(url);

    window.events.addListener('append_episode', onLoad); 

    function onLoad(track, pkg, html) {
        if (pkg.name === name) {
            window.events.removeListener('append_episode', onLoad);
            console.log('appending episode');

            div.innerHTML = html;
            feedback(div, function(r) {
                window.events.emit('finished_episode', model);
            });
        }
    }
}

module.exports.appendEpisode = appendEpisode;
