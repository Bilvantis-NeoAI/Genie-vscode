import * as vscode from 'vscode';

let BASE_API = "";

export const review_config:string = 'HSBC';
export const ANSWER_CONFIG = "chroma";

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
