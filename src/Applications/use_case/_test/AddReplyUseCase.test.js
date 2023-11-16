/* eslint-disable max-len */
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply use case properly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      content: 'reply content',
      owner: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockCommentRepository.verifyAvailableCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    ));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableCommentInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new NewReply(useCasePayload));
  });
});
