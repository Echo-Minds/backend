@echo off
REM Script to run Git commands sequentially on Windows

REM Add all changes
echo Adding all changes...
git add .

REM Pull the latest changes from the main branch
echo Pulling the latest changes from the 'main' branch...
git pull origin main
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Git pull failed. Please resolve conflicts and try again.
    pause
    exit /b %ERRORLEVEL%
)

REM Prompt the user for a commit message
set /p commit_msg="Enter the commit message: "

REM Commit the changes with the provided message
git commit -m "%commit_msg%"
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Git commit failed. Please ensure there are changes to commit.
    pause
    exit /b %ERRORLEVEL%
)

REM Push the changes to the main branch
echo Pushing changes to the 'main' branch...
git push origin main
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Git push failed. Please check your network connection or credentials.
    pause
    exit /b %ERRORLEVEL%
)

echo Git operations completed successfully!
pause

