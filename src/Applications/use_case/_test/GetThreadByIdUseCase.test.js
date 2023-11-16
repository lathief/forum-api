const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeUnlikeRepository = require('../../../Domains/likes/LikeRepository');
const GetThreadUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'ini adalah judul thread',
      body: 'ini adalah isi thread',
      date: '2022',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022',
        content: 'ini adalah isi komentar',
        is_deleted: false,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'ini adalah isi balasan',
        date: '2022',
        username: 'jhon',
        comment_id: 'comment-123',
        is_deleted: false,
      },
    ];

    const expectedLikeCount = [
      {
        comment_id: 'comment-123',
      },
      {
        comment_id: 'comment-123',
      },
    ];
    const mappedComments = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);
    const mappedReplies = expectedReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);
    const mappedLikeCount = expectedLikeCount.map(({ comment_id }) => comment_id);

    const expectedCommentsAndReplies = [
      {
        ...mappedComments[0],
        likeCount: mappedLikeCount.length,
        replies: mappedReplies,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeUnlikeRepository = new LikeUnlikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'ini adalah judul thread',
        body: 'ini adalah isi thread',
        date: '2022',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2022',
          content: 'ini adalah isi komentar',
          is_deleted: false,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: 'ini adalah isi balasan',
          date: '2022',
          username: 'jhon',
          comment_id: 'comment-123',
          is_deleted: false,
        },
      ]));
    mockLikeUnlikeRepository.getLikeCountComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment_id: 'comment-123',
        },
        {
          comment_id: 'comment-123',
        },
      ]));
    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockReplyRepository,
      likesRepository: mockLikeUnlikeRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    expect(theThread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockLikeUnlikeRepository.getLikeCountComment).toBeCalledWith(useCasePayload.threadId);
  });

  it('should not display deleted comment', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'ini adalah judul thread',
      body: 'ini adalah isi thread',
      date: '2022',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        date: '2022',
        username: 'jhon',
        comment_id: 'comment-123',
        is_deleted: true,
      },
    ];
    const expectedLikeCount = [
      {
        comment_id: 'comment-123',
      },
      {
        comment_id: 'comment-123',
      },
    ];

    const mappedComments = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);
    const mappedReplies = expectedReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);
    const mappedLikeCount = expectedLikeCount.map(({ comment_id }) => comment_id);

    const expectedCommentsAndReplies = [
      {
        ...mappedComments[0],
        likeCount: mappedLikeCount.length,
        replies: mappedReplies,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeUnlikeRepository = new LikeUnlikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'ini adalah judul thread',
        body: 'ini adalah isi thread',
        date: '2022',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2022',
          content: '**komentar telah dihapus**',
          is_deleted: true,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: '**balasan telah dihapus**',
          date: '2022',
          username: 'jhon',
          comment_id: 'comment-123',
          is_deleted: true,
        },
      ]));
    mockLikeUnlikeRepository.getLikeCountComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comment_id: 'comment-123',
        },
        {
          comment_id: 'comment-123',
        },
      ]));

    const mockGetThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockReplyRepository,
      likesRepository: mockLikeUnlikeRepository,
    });

    const theThread = await mockGetThreadUseCase.execute(useCasePayload.threadId);

    expect(theThread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockLikeUnlikeRepository.getLikeCountComment).toBeCalledWith(useCasePayload.threadId);
  });
});
