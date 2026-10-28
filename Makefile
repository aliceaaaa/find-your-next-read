.PHONY: build deploy deploy-sitemap

build:
	npm run sitemap
	npm run build
	npm run prerender

deploy: build
	rsync -avz --delete build/ famchat:/root/findyournextread/frontend/

deploy-sitemap:
	npm run sitemap
	rsync -avz public/sitemap.xml famchat:/root/findyournextread/frontend/sitemap.xml
