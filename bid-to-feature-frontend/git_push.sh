#!/bin/bash

# gacp

npm run build

# Prompt the user for a commit message
read -p "Enter commit message: " commit_message

# Add all changes
git add .

# Commit with the provided message
git commit -m "$commit_message"


git push

echo "Changes committed with message: '$commit_message'"
