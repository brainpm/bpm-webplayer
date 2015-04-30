all: build/styles.css build/index.html

build/index.html: index.jade
	mkdir -p build
	node_modules/.bin/jade < index.jade > build/index.html

build/styles.css: styles.styl
	mkdir -p build
	node_modules/.bin/stylus < styles.styl > build/styles.css

