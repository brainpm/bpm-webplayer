var _ = require('lodash');

var knowledge = [];

module.exports = function(selector) {
    var el = document.querySelector(selector);

    var api = {};

    api.addKnowledge = function(items) {
        item = _.difference(items, knowledge);
        _.forEach(items, function(item) {
            var li = document.createElement('li');
            li.setAttribute('title', item);
            li.innerHTML = item;
            el.appendChild(li);
            li.addEventListener('click', function() {
                window.events.emit('knowledge_clicked', item);
            });
            knowledge.push(item);
        });
    };

    api.knowledge = function() {
        return knowledge;
    };

    return api;
};
