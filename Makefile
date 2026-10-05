.PHONY: build deploy

build:
	npm run sitemap
	npm run build
	npm run prerender

deploy: build
	rsync -avz --delete build/ famchat:/root/findyournextread/frontend/
