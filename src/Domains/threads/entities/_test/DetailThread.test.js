const DetailThead = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2022',
      username: 'user-123',
    };

    expect(() => new DetailThead(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2022',
      username: 'user-123',
    };

    expect(() => new DetailThead(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'ini adalah isi thread',
      date: '2022',
      username: 'user-123',
    };

    const {
      id, title, body, date, username,
    } = new DetailThead(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
