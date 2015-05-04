var appendScriptTag = require('../jsonp/jsonp');
var getEpisodeUrl = require('brainpm/lib/urls').getEpisodeUrl;

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

    function addToTOC(bundleExports) {
        var html = bundleExports.getHTML();
        var track = bundleExports.pkg.brain.track;
        var episode = toc[bundleExports.pkg.name];
        episode.pkg = bundleExports.pkg;
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
        // repositories that match the name of
        // the organisation are not episodes,
        // instead they define globals settings
        // for that organisation.
        if (r.name !== r.owner.login) {
            toc[r.name] = {repo: r};
            var url = getEpisodeUrl(r.owner.login, r.name);
            appendScriptTag(url);
        } else {
            togo--;
        }
    }
};

appendScriptTag(listRepoUrl);
