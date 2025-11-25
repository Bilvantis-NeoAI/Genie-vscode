import * as vscode from 'vscode';

let BASE_API = "";
let GHE_TOKEN = "";

export const review_config:string = 'HSBC';
export const ANSWER_CONFIG = "chroma";
export const fieldIgnore = ['score'];

export const getBaseApi = (): string => BASE_API;

export const setBaseApi = (userUrl: string): void => {
    BASE_API = userUrl;
};

export const exchangeUrl = (context: vscode.ExtensionContext, userUrl: string) => {
    setBaseApi(userUrl);
    context.globalState.update('USER_BASE_API', userUrl);
};

export const loadBaseApi = (context: vscode.ExtensionContext) => {
    const storedBaseApi = context.globalState.get<string>('USER_BASE_API');
    if (storedBaseApi) {
        setBaseApi(storedBaseApi);
    }
    console.log("Loaded BASE_API:", getBaseApi());
};


// Git token action get, set and access
export const getGitToken = (): string => GHE_TOKEN;

export const setGitToken = (gitToken: string): void => {
    GHE_TOKEN = gitToken;
    console.log("GHE_TOKEN set", GHE_TOKEN);
};

export const exchangeGitToken = (context: vscode.ExtensionContext, gitToken: string) => {
    setGitToken(gitToken);
    context.globalState.update('USER_GIT_TOKEN', gitToken);
};

export const loadGitToken = (context: vscode.ExtensionContext) => {
    const storedGitToken = context.globalState.get<string>('USER_GIT_TOKEN');
    if (storedGitToken) {
        setGitToken(storedGitToken);
    }

    console.log("Loaded GHE_TOKEN:", getGitToken());
};
