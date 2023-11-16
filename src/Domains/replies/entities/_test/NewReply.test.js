const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah balasan',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: true,
      content: 123,
      owner: 'user-123',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const { commentId, content, owner } = new NewReply(payload);

    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
