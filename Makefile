.PHONY: build deploy

build:
	npm run build

deploy: build
	rsync -avz --delete build/ famchat:/root/findyournextread/frontend/
