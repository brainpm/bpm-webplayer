var Spinner = require('spin');
var moment = require('moment');

var feedback = require('../feedback/feedback');
var getEpisodeUrl = require('brainpm/lib/urls').getEpisodeUrl;
var appendScriptTag = require('../jsonp/jsonp');
var template = require('./episode.jade');

function appendEpisode(container, model, cb) {
    var name = model.pkg.name;

    var div = document.createElement('div');
    div.classList.add('episode');
    div.classList.add(model.pkg.brain.track);
    div.setAttribute('name', name);
    container.appendChild(div);
    var spinner = new Spinner({color:'#111', lines: 12});
    spinner.spin(div);

    var url = getEpisodeUrl('shecodes-content', name);
    appendScriptTag(url);

    window.events.addListener('append_episode', onLoad); 

    function onLoad(bundleExports) {
        var pkg = bundleExports.pkg;
        if (pkg.name === name) {
            window.events.removeListener('append_episode', onLoad);
            console.log('appending episode');
            
            html = template({
                moment: moment,
                model:model, 
                content: bundleExports.getHTML()
            });
            div.innerHTML = html;

            var frag = bundleExports.getDocumentFragment();
            div.querySelector('.body').appendChild(frag);
            spinner.stop();

            feedback(div, function(r) {
                window.events.emit('finished_episode', model);
            });
            cb(null);
        }
    }
}

module.exports.appendEpisode = appendEpisode;
