var appendScriptTag = require('./jsonp');
var getEpisodeURL = require('./urls').getEpisodeURL;

var listReposUrl = "https://api.github.com/orgs/shecodes-content/repos?callback=repoCallback&type=public";

window.repoCallback = function(o) {
    if (o.meta.status !==  200) {
        console.log('failed to discover content. Server response: ', o.meta.status);
        return;
    }
    window.events.emit('start_episode_discovery');
    var repos = o.data;
    var togo = repos.length;
    var toc = {};

    function addToTOC(track, meta, html) {
        meta.updated_at = toc[meta.name].updated_at;
        toc[meta.name] = meta;
        window.events.emit('discovered_episode', meta, meta.updated_at);
        if (--togo === 0) {
            console.log(toc);
            window.events.removeListener('append_episode', addToTOC); 
            window.events.emit('end_episode_discovery', toc);
        }
    }
    window.events.addListener('append_episode', addToTOC); 
    for(var i=0; i<repos.length; ++i) {
        var r = repos[i];
        console.log(r.owner.login, r.name, r.updated_at);
        toc[r.name] = {updated_at: r.updated_at};
        var url = getEpisodeURL(r.owner.login, r.name);
        appendScriptTag(url);
    }
};

appendScriptTag(listReposUrl);
