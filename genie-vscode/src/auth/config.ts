import * as vscode from 'vscode';

let BASE_API = ""; // Default API URL
export const ANSWER_CONFIG = "chroma";

// Getter function for BASE_API
export const getBaseApi = (): string => BASE_API;

// Setter function to update BASE_API safely
export const setBaseApi = (userUrl: string): void => {
    BASE_API = userUrl;
};

// Function to update BASE_API and store it in global state
export const exchangeUrl = (context: vscode.ExtensionContext, userUrl: string) => {
    setBaseApi(userUrl);
    context.globalState.update('USER_BASE_API', userUrl);
};

// Function to load BASE_API from global state when extension starts
export const loadBaseApi = (context: vscode.ExtensionContext) => {
    const storedBaseApi = context.globalState.get<string>('USER_BASE_API');
    if (storedBaseApi) {
        setBaseApi(storedBaseApi);
    }
    console.log("Loaded BASE_API:", getBaseApi());
};
