@echo off
echo Uploading changes to GitHub...
git add .
git commit -m "Update site"
git push
echo.
echo Done! Vercel will update the site in 1-2 minutes.
pause
