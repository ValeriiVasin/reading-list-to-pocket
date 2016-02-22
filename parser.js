'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');

const plist = require('plist');

// get JSON representation of bookmars plist
const getPlist = () => {
  const filepath = '~/Library/Safari/Bookmarks.plist';

  return plist.parse(
    execSync(`/usr/bin/plutil -convert xml1 -o - ${filepath}`, { encoding: 'utf8' })
  );
};

const getReadingList = plist => {
  const items = getPlist()
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
}

fs.writeFileSync('result.json', JSON.stringify(getReadingList(getPlist()), null, 2));
