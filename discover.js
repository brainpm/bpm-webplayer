var appendScriptTag = require('./jsonp');
var getEpisodeURL = require('./urls').getEpisodeURL;

var github_organisation = process.env.github_organisation;
var listRepoUrl = "https://api.github.com/orgs/" + github_organisation + "/repos?callback=repoCallback&type=public";

window.repoCallback = function(o) {
    if (o.meta.status !==  200) {
        throw new Error('failed to discover content. Server response: ', o.meta.status, 'requested URL was:', listRepoUrl);
    }
    window.events.emit('start_episode_discovery');
    var repos = o.data;
    var togo = repos.length;
    var toc = {};

    function addToTOC(track, pkg, html) {
        var episode = toc[pkg.name];
        episode.pkg = pkg;
        window.events.emit('discovered_episode', episode, episode.repo.updated_at);
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
        toc[r.name] = {repo: r};
        var url = getEpisodeURL(r.owner.login, r.name);
        appendScriptTag(url);
    }
};

appendScriptTag(listRepoUrl);
