var _ = require('lodash');
var liveStream = require('level-live-stream');
var itemTemplate = require('./inventory-item.jade');

var knowledge = [];

module.exports = function(selector, logdb) {
    var el = document.querySelector(selector);

    var api = {};

    var stream = liveStream(logdb, {tail:true, min: "\x00", max:"\xff"});
    stream.on('data', function(data) {
        var logEntry = JSON.parse(data.value);
        if (logEntry.action === "knowledge_acquired") {
            api.addKnowledge(logEntry.provides);
        }
    });
    api.addKnowledge = function(items) {
        if (typeof (items) === "string") {
            var dummy = items;
            items = [dummy];
        }
        items = _.difference(items, knowledge);
        _.forEach(items, function(item) {
            var html = itemTemplate({item: item});
            var dummy = document.createElement('div');
            dummy.innerHTML = html;
            var li = dummy.children[0];
            li.addEventListener('click', function() {
                window.events.emit('knowledge_clicked', item);
            });
            el.appendChild(li);
            knowledge.push(item);
        });
    };

    api.knowledge = function() {
        return knowledge;
    };

    return api;
};
