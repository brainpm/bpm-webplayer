var _ = require('lodash');
var getMenu = require('brainpm').getMenu;
var template = require('./menu.jade');

module.exports.getMenuHTML = getMenuHTML;
module.exports.appendMenu = appendMenu;

function getMenuHTML(toc, history, knowledge, tracks, trackNames, n) {
    var menu = getMenu(toc, history, knowledge, tracks, n); 
    return template({tracks:tracks, trackNames:trackNames, menu:menu});
}

function appendMenu(el, toc, history, knowledge, tracks, trackNames, n) {
    var frag = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = getMenuHTML(toc, history, knowledge, tracks, trackNames, n);
    while (div.firstChild) frag.appendChild(div.firstChild);

    var menu = frag.querySelector('.menu');
    var buttons = frag.querySelectorAll('.choice button');
    _.each(buttons, function(button) {
        button.addEventListener('click', function(e) {
            console.log('button', e.target);
            window.events.emit('episode_chosen', {
                menu: menu, 
                episode: toc[e.target.name]
            });
        });        
    });
    el.appendChild(frag);
}
