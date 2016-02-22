const normalize = require('../lib').normalize;

describe('Library', () => {
  describe('normalize()', () => {
    it('Parse strings correctly', () => {
      expect(normalize({
        "key": [
          "Key",
          "ServerID"
        ],
        "string": [
          "Key (hidden)",
          "ServerId (hidden)"
        ]
      })).toEqual({
        "Key": "Key (hidden)",
        "ServerID": "ServerId (hidden)"
      })
    });
  });
});
