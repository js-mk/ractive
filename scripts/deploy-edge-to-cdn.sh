#!/bin/bash

# deploy script based on https://medium.com/philosophy-logic/53a8270e87db
if [ "$TRAVIS_PULL_REQUEST" == "false" -a "$TRAVIS_BRANCH" == "dev" ]; then
	echo "Deploying edge version to CDN..."

	echo "Cloning repo..."
	git clone https://Rich-Harris:${GH_TOKEN}@${GH_REF} cdn

	echo "Copying latest builds..."
	rm -r cdn/edge
	cp -r build/ cdn/edge

	( cd cdn

		echo "Setting credentials..."
		git remote rm origin
		git remote add origin https://Rich-Harris:${GH_TOKEN}@${GH_REF}

		echo "Adding files..."
		git add -A
		git commit -m "Updated edge version"

		echo "Pushing to GitHub..."
		git push
	)
fi
