'use strict';

const xml2js = require('xml2js').parseString;
const execSync = require('child_process').execSync;
const fs = require('fs');
const each = require('lodash/each');

const Observable = require('rx').Observable;

const findReadingListItems = (json, options, onItemFound) => {
  if (Array.isArray(json) || typeof json === 'object') {
    each(json, (value, key) => {
      findReadingListItems(value, {
        parents: [
          ...options.parents,
          { key: key, value: value }
        ]
      }, onItemFound);
    });

    return;
  }

  if (json === 'ReadingList') {
    // hard coded item definition
    onItemFound(
      options.parents[options.parents.length - 3].value
    );
  }
};

const createReadingListItemsStream = () => {
  return Observable.create(function(observer) {
    const xml = execSync('/usr/bin/plutil -convert xml1 -o - ~/Library/Safari/Bookmarks.plist', { encoding: 'utf8' });

    xml2js(xml, (err, result) => {
      findReadingListItems(result, { parents: [] }, (item) => observer.onNext(item));
      observer.onCompleted();
    });
  });
};

const parseItem = (item) => {
  let result;

  try {
    result = {
      addedOn: item.dict[0].date[0],
      title: item.dict[1].string[0],
      preview: item.dict[0].string[0],
      url: item.string[0]
    };
  } catch (err) {
    ERRORED_ITEMS.push({ message: err.message, item });
  }

  return result;
};

const ERRORED_ITEMS = [];

createReadingListItemsStream()
  .map(parseItem)
  .subscribe(
    // (item) => console.log(`======= \n${JSON.stringify(item, null, 2)}`),
    (d) => d,
    null,
    () => {
      fs.writeFileSync('errors.json', JSON.stringify(ERRORED_ITEMS, null, 2));
      console.log('errored: ', ERRORED_ITEMS.length);
    }
  );
