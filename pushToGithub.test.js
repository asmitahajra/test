const fs = require('fs');
const pushFunctions = require('./pushToGithub');

describe('getFiles', () => {
  const mockDir = 'handlers';
  const mockFiles = ['health.handler.js'];
  const arratOfFiles = [];
  const expectedValue = ['handlers/health.handler.js'];
  //   const failedMockStatSyncValue = {
  //     isDirectory() { return false; },
  //   };
  const mockStatSyncValue = {
    isDirectory() { return false; },
  };
  it('should return ', () => {
    const spyOnReaddirSync = jest.spyOn(fs, 'readdirSync');
    spyOnReaddirSync.mockReturnValueOnce(mockFiles);
    const spyOnStatSync = jest.spyOn(fs, 'statSync');
    spyOnStatSync.mockReturnValueOnce(mockStatSyncValue);
    const result = pushFunctions.getFiles(mockDir, arratOfFiles);
    expect(result).toEqual(expectedValue);
  });
});

describe('getAllFilesFunction', () => {
  const mockFolders = ['abc.js'];
  const expectedValue = ['abc.js'];
  const mockstatSyncValue = {
    isFile() { return true; },
  };

  it('should return final array of all files in various directories', () => {
    const spyOnStatSync = jest.spyOn(fs, 'statSync');
    spyOnStatSync.mockReturnValueOnce(mockstatSyncValue);
    const spyOnGetAllFiles = jest.spyOn(pushFunctions, 'getFiles');
    spyOnGetAllFiles.mockReturnValueOnce('handlers/health.handler.js');
    const result = pushFunctions.getAllFilesFunction(mockFolders);
    expect(result).toEqual(expectedValue);
  });
});

describe('getAllFileData', () => {
  const mockAllFiles = ['handlers/health.handler.js', 'handlers/index.js'];
  const expectedValue = [{ content: 'abc', path: 'handlers/health.handler.js' }, { content: 'def', path: 'handlers/index.js' }];
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return array of objects having properties content and path', () => {
    const spyOnReadFileSync = jest.spyOn(fs, 'readFileSync');
    spyOnReadFileSync.mockReturnValueOnce('abc');
    spyOnReadFileSync.mockReturnValueOnce('def');
    const result = pushFunctions.getAllFileData(mockAllFiles);
    // console.log(result);
    expect(result).toEqual(expectedValue);
  });
});

describe('pushToGithub', () => {
  // const mockFolders = ['handlers'];
  // const mockAuthToken = 'abc';
  const mockUsername = 'abc';
  const mockRepoName = 'abc';
  const mockBranchName = 'main';
  const mockCommitMsg = 'commit';
  const mockFolders = ['handlers'];
  const mockAuth = 'abc';
  const mockDataToPush = [{ content: 'abc', path: 'handlers/health.handler.js' }];
  it('pushes folders to github', async () => {
    const mockGithubImplementation = {
      setRepo: jest.fn(),
      setBranch: jest.fn().mockImplementation(() => Promise.resolve()),
      pushFiles: jest.fn()
    };
    pushFunctions.GithubAPI = jest.fn(() => mockGithubImplementation);

    const spyOnGetAllFilesFunction = jest.spyOn(pushFunctions, 'getAllFilesFunction');
    spyOnGetAllFilesFunction.mockReturnValueOnce(['handlers']);

    const spyOnGetAllFileData = jest.spyOn(pushFunctions, 'getAllFileData');
    spyOnGetAllFileData.mockReturnValueOnce(mockDataToPush);

    await pushFunctions.pushToGithub(
      mockFolders, mockAuth, mockUsername, mockRepoName, mockBranchName, mockCommitMsg,
    );

    expect(mockGithubImplementation.setRepo).toHaveBeenCalledWith(mockUsername, mockRepoName);
    expect(mockGithubImplementation.setBranch).toHaveBeenCalledWith(mockBranchName);
    expect(mockGithubImplementation.pushFiles).toHaveBeenCalledWith(mockCommitMsg, mockDataToPush);
  });
});

