const fs = require('fs');
const GitHub = require('github-api');
jest.mock('./pushToGithub');
const { GithubAPI } = require('./pushToGithub');

// jest.mock('./pushToGithub', () => ({
//   ...require.requireActual('./pushToGithub'),
//   getAllFilesFunction: jest.fn(),
//   getAllFileData: jest.fn(),
// }));
const pushFunctions = require('./pushToGithub');
// const GitHubAPI= require('./')

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
  it('pushes folders to github', () => {
    GithubAPI.prototype.setRepo = jest.fn();
    const { setRepo } = GithubAPI.prototype;
    GithubAPI.prototype.setBranch = jest.fn();
    const { setBranch } = GithubAPI.prototype;
    GithubAPI.prototype.pushFiles = jest.fn();
    const { pushFiles } = GithubAPI.prototype;

    const spyOnGetAllFilesFunction = jest.spyOn(pushFunctions, 'getAllFilesFunction');
    spyOnGetAllFilesFunction.mockReturnValueOnce(['handlers']);

    // pushFunctions.getAllFilesFunction = jest.fn();
    // const { getAllFilesFunction } = pushFunctions.getAllFilesFunction;
    // pushFunctions.getAllFilesFunction.mockReturnValue(['handlers/health.handler.js']);

    // pushFunctions.getAllFileData = jest.fn();
    // const { getAllFileData } = pushFunctions.getAllFileData;
    // pushFunctions.getAllFileData.mockReturnValue(mockDataToPush);

    const spyOnGetAllFileData = jest.spyOn(pushFunctions, 'getAllFileData');
    spyOnGetAllFileData.mockReturnValueOnce(mockDataToPush);

    const result = pushFunctions.pushToGithub(
      mockFolders, mockAuth, mockUsername, mockRepoName, mockBranchName, mockCommitMsg,
    );

    expect(setRepo).toHaveBeenCalledWith(mockUsername, mockRepoName);
    expect(setBranch).toHaveBeenCalledWith(mockBranchName);
    expect(pushFiles).toHaveBeenCalledWith(mockCommitMsg, mockDataToPush);
  });
});
