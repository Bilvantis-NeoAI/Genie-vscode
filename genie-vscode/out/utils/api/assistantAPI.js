"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCodeGenerationAssistant = postCodeGenerationAssistant;
exports.postAddCommentsAssistant = postAddCommentsAssistant;
exports.postAddDocStringsAssistant = postAddDocStringsAssistant;
exports.postExplainCodeAssistant = postExplainCodeAssistant;
exports.postUnittestCodeAssistant = postUnittestCodeAssistant;
exports.postAddLoggingAssistant = postAddLoggingAssistant;
exports.postAddErrorHandlingAssistant = postAddErrorHandlingAssistant;
exports.postRefactorCodeAssistant = postRefactorCodeAssistant;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../auth/config");
const apiHeaders_1 = require("../../auth/apiHeaders");
async function postCodeGenerationAssistant(prompt, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/code-generation`, { prompt, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postAddCommentsAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/add-comments`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postAddDocStringsAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/add-docstrings`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postExplainCodeAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/explain-code`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postUnittestCodeAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/unittest-code`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postAddLoggingAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/add-logging`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postAddErrorHandlingAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/add-error-handlng`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postRefactorCodeAssistant(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/assistant/refactor-code`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
//# sourceMappingURL=assistantAPI.js.map