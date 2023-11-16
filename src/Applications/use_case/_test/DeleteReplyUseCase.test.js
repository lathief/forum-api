const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(1));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(1));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.replyId,
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.replyId);
  });
});
