# Version Control

Current version: **v2.4**

## Instructions for AI Assistants

When making updates to the website:
1. Always increment the version number by 0.1 (e.g., 1.2 → 1.3)
2. Update the version in `index.html` in the `.version` div
3. Update this file with the new version number
4. Version format: `v[major].[minor]`

## Version History

- v2.4 - Added mobile responsive design for phones and tablets
- v2.3 - Configured Upstash Redis environment variables for view counter
- v2.2 - Added Redis initialization check, improved error handling and logging for view counter
- v2.1 - Reduced view counter cooldown from 5 minutes to 1 minute, improved IP detection
- v2.0 - Fixed audio seek issue (sound disappearing when dragging progress bar), optimized loading with video poster
- v1.9 - Applied custom Square721 font, adjusted media sizes
- v1.2 - Fixed Redis connection, added version indicator
- v1.1 - Added glassmorphism effect, increased particle count
- v1.0 - Initial release
