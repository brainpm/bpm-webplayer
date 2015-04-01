var getMenu = require('brainpm').getMenu;
var template = require('./menu.jade');

module.exports.getMenuHTML = getMenuHTML;

function getMenuHTML(toc, history, knowledge, tracks, n) {
    var menu = getMenu(toc, history, knowledge, tracks, n); 
    return template({tracks:tracks, menu:menu});
}
