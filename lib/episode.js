var Spinner = require('spin');
var moment = require('moment');

var feedback = require('./feedback');
var getEpisodeURL = require('./urls').getEpisodeURL;
var appendScriptTag = require('./jsonp');
var template = require('./episode.jade');

function appendEpisode(container, model) {
    var name = model.pkg.name;

    var div = document.createElement('div');
    div.classList.add('episode');
    div.setAttribute('name', name);
    container.appendChild(div);
    var spinner = new Spinner({color:'#111', lines: 12});
    spinner.spin(div);

    var url = getEpisodeURL('shecodes-content', name);
    appendScriptTag(url);

    window.events.addListener('append_episode', onLoad); 

    function onLoad(track, pkg, html, exports) {
        if (pkg.name === name) {
            window.events.removeListener('append_episode', onLoad);
            console.log('appending episode');
            
            if (typeof(exports) !== 'undefined') {
                var frag = exports.getDocumentFragment();
                div.appendChild(frag);
                spinner.stop();
            } else {
                html = template({
                    moment: moment,
                    model:model, 
                    content: html
                });
                div.innerHTML = html;
            }
            feedback(div, function(r) {
                window.events.emit('finished_episode', model);
            });
        }
    }
}

module.exports.appendEpisode = appendEpisode;
