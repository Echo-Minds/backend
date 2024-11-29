#!/bin/bash

# Add all changes
echo "Adding all changes..."
git add .

# Pull the latest changes from the main branch
echo "Pulling the latest changes from the 'main' branch..."
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
  echo "Error: Git pull failed. Please resolve conflicts and try again."
  exit 1
fi

# Prompt the user for a commit message
echo -n "Enter the commit message: "
read commit_msg

# Commit the changes with the provided message
git commit -m "$commit_msg"

# Check if commit was successful
if [ $? -ne 0 ]; then
  echo "Error: Git commit failed. Please ensure there are changes to commit."
  exit 1
fi

# Push the changes to the main branch
echo "Pushing changes to the 'main' branch..."
git push origin main

# Check if push was successful
if [ $? -ne 0 ]; then
  echo "Error: Git push failed. Please check your network connection or credentials."
  exit 1
fi

echo "Git operations completed successfully!"

