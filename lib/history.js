var _ = require('lodash');
var rafScroll = require('raf-scroll');
var itemTemplate = require('./history-item.jade');
var visited = [];

module.exports = function(selector) {
    var el = document.querySelector(selector);

    var api = {};

    api.appendEpisode = function(episode) {
        var html = itemTemplate({episode: episode});
        var dummy = document.createElement('div');
        dummy.innerHTML = html;
        var li = dummy.children[0]; 
        el.appendChild(li);
        li.addEventListener('click', function() {
            window.events.emit('history_clicked', episode);
        });
        visited.push(episode.pkg.name);
    };

    api.visited = function() {
        return visited;
    };

    rafScroll.add(function(event) {
        var y = event.scrollY;

        // remove 'current' class from all
        _.forEach(el.querySelectorAll('li'), function(li) {
            li.classList.remove('current');
        });
        
        var episodes = document.querySelectorAll('.episode');
        var currentEpisode = _.find(episodes, function(e) {
            var bottom = e.offsetTop + e.offsetHeight;
            return bottom > y + 100;
        });
        if (typeof(currentEpisode) !== 'undefined') {
            var name = currentEpisode.getAttribute('name');
            var currentLi = el.querySelector('li[name=' + name + ']');
            if (currentLi) {
                currentLi.classList.add('current');
            }
        } else {
        }
    });

    return api;
};
