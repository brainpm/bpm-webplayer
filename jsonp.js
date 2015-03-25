
module.exports = function(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('lang', 'javascript');
    document.body.appendChild(script);
};
