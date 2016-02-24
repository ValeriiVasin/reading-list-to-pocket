'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const plist = require('plist');
const pocket = require('pocket-api');

const PLIST_FILEPATH = '~/Library/Safari/Bookmarks.plist';

const readLocalPlist = () => {
  return execSync(`/usr/bin/plutil -convert xml1 -o - ${PLIST_FILEPATH}`, { encoding: 'utf8' });
};

const getReadingList = (plistContent) => {
  const items = plist.parse(plistContent)
    .Children
      .find(item => item.Title === 'com.apple.ReadingList')
        .Children;

  return items.map(item => {
    let result = {
      createdOn: item.ReadingList.DateAdded,
      previewText: item.ReadingListNonSync.PreviewText || item.ReadingList.PreviewText,
      title: item.ReadingListNonSync.Title || item.ReadingList.Title || item.URIDictionary.title,
      url: item.URLString
    };

    return result;
  });
};

const sync = (params) => {
  const plistContent = params.plistContent;
  const consumerKey = params.consumerKey;
  const accessToken = params.accessToken;

  const items = getReadingList(plistContent);

  if (items.length === 0) {
    console.log('Your Reading List is empty. Nothing to sync...');
    return Promise.resolve();
  }

  const actions = items.map(item => ({
    action: 'add',
    time: Math.round(Date.parse(item.createdOn) / 1000),
    url: item.url,
    tags: 'safari-reading-list'
  }));

  console.log(`Syncing ${items.length} items...`);

  return new Promise((resolve, reject) => {
    pocket.modifyArticles(actions, consumerKey, accessToken, (error, data) => {
        if (error) {
           reject(error);
        }

        resolve(data);
      }
    );
  }).then((result) => {
    console.log('syncing done...');
    return result;
  });
};

/**
 * @param  {Object} params             Local sync params
 * @param  {String} params.consumerKey Consumer key
 * @param  {String} params.accessToken Access token
 * @return {Promise}                   Promise that will be resolved on done
 */
const syncLocal = (params) => {
  const plistContent = readLocalPlist();
  const consumerKey = params.consumerKey;
  const accessToken = params.accessToken;

  return sync({
    plistContent: plistContent,
    consumerKey: consumerKey,
    accessToken: accessToken
  });
};

module.exports = {
  getReadingList: getReadingList,
  sync: sync,
  syncLocal: syncLocal
};
