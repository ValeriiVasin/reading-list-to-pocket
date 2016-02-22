'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const plist = require('plist');

const PLIST_FILEPATH = '~/Library/Safari/Bookmarks.plist';

// get JSON representation of bookmars plist
const getPlist = () => {
  return plist.parse(
    execSync(`/usr/bin/plutil -convert xml1 -o - ${PLIST_FILEPATH}`, { encoding: 'utf8' })
  );
};

const getReadingList = (text) => {
  const items = plist.parse(text)
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

module.exports = {
  getReadingList: getReadingList
};
