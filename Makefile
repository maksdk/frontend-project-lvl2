install:
	npm install

publish:
	npm run build
	npm publish

run:
	npx babel-node src/bin/genDiff.js
	
lint:
	npx eslint .

debug:
	npm run debug