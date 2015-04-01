
module.exports = function(url) {
    var script = document.createElement('script');
    script.setAttribute('lang', 'javascript');
    script.onload = function() {
        console.log('loaded <script> from', url);
    };
    document.body.appendChild(script);
    script.setAttribute('src', url);
};
