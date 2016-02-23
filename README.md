# reading-list-to-pocket

Simple importer that helps you to import your Safari Reading List to Pocket.

1. Install `reading-list-to-pocket` npm package globally
```bash
npm install -g reading-list-to-pocket
```
2. Register your own pocket application [here](https://getpocket.com/developer/apps/new) with at least **add** and **modify** permissions. Remember your consumer key - it will be used later on.

3. Sync your Safari Reading List with pocket
```bash
sync-reading-list --consumer-key <YOUR_APP_CONSUMER_KEY>
```
