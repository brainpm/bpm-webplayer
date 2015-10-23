var getRetrievalStream = require('bpm-publish/lib/get-retrieval-stream');
var getMetaData = require('bpm-bundle/lib/debundle').getMetaData;
var through = require('through');
var JSONStream = require('JSONStream');
var concat = require('concat-stream');
var map = require('map-stream');
var pull = require('pull-stream');

module.exports = function(github_organisation) {
    window.events.emit('start_episode_discovery');
    pull(
        getRetrievalStream(github_organisation),
        pull.asyncMap(getMetaData),
        pull.through(function(meta) {
            var updated_at = new Date().toString();
            window.events.emit(
                'discovered_episode', {pkg: meta}, updated_at);
        }),
        pull.collect(function(err, toc) {
            if (err) {
                console.log('Failed to get TOC', err);
                return;
            }
            var o = {};
            toc.forEach(function(e) {
                o[e.name] = {pkg: e, repo: {updated_at: Date.now().toString()}};
            });
            console.log('discovered TOC', o);
            window.events.emit('end_episode_discovery', o);
        })
    );
};

