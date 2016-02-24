# reading-list-to-pocket

Simple importer that helps you to import your Safari Reading List to Pocket.

1. Install `reading-list-to-pocket` npm package globally
```bash
npm install -g reading-list-to-pocket
```
2. Register your own pocket application [here](https://getpocket.com/developer/apps/new) with at least **add** and **modify** permissions. Remember your consumer key - it will be used later on.

3. Sync your Safari Reading List with pocket
```bash
# providing consumer key as cli argument
reading-list-to-pocket --consumerKey <YOUR_APP_CONSUMER_KEY>
# providing key as environment variable
POCKET_CONSUMER_KEY=<YOUR_APP_CONSUMER_KEY> reading-list-to-pocket
```

***TIP:*** If you are going to sync your reading list with pocket more then once its better to set consumer key environment variable in `.bash_profile`.
