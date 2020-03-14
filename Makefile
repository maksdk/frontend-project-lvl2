install:
	npm install

publish:
	npm run build
	npm publish

lint:
	npx eslint .

debug:
	npm run debug