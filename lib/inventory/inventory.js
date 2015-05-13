var _ = require('lodash');
var liveStream = require('level-live-stream');

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
            dummy = items;
            items = [dummy];
        }
        items = _.difference(items, knowledge);
        _.forEach(items, function(item) {
            var li = document.createElement('li');
            li.setAttribute('title', item);
            li.innerHTML = '<i class="fa fa-diamond"></i><span>' + item + '</span>';
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
