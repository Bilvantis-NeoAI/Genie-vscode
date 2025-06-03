import * as vscode from 'vscode';

let BASE_API = "";
let KB_BASE_API = "";

export const review_config:string = 'HSBC';

// export const ANSWER_CONFIG = "chroma";
// export const SESSION_ID = "00a20e59-cc63-49d0-a6e5-92a6d9d4856d";
export const SESSION_ID = "2568ac9e-157f-4a9f-852a-83caabe94dc3";
export const DB_QUERY = false;

// Getter function for BASE_API
export const getBaseApi = (): string => BASE_API;
export const getKbBaseApi = (): string => KB_BASE_API;

// Setter function to update BASE_API safely
export const setBaseApi = (userUrl: string): void => {
    BASE_API = userUrl;
};
export const setKbBaseApi = (KUrl: string): void => {
    KB_BASE_API = KUrl;
};

// Function to update BASE_API and store it in global state
export const exchangeUrl = (context: vscode.ExtensionContext, userUrl: string, KUrl: string) => {
    setBaseApi(userUrl);
    setKbBaseApi(KUrl);
    context.globalState.update('USER_BASE_API', userUrl);
    context.globalState.update('USER_KB_BASE_API', KUrl);
};

// Function to load BASE_API from global state when extension starts
export const loadBaseApi = (context: vscode.ExtensionContext) => {
    const storedBaseApi = context.globalState.get<string>('USER_BASE_API');
    const storedKbBaseApi = context.globalState.get<string>('USER_KB_BASE_API');

    if (storedBaseApi) {
        setBaseApi(storedBaseApi);
    }
    if (storedKbBaseApi) {
        setKbBaseApi(storedKbBaseApi);
    }
    console.log("Loaded BASE_API:", getBaseApi());
    console.log("Loaded KBASE API:", getKbBaseApi());
};
