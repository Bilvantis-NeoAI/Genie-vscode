"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReviewCode = postReviewCode;
exports.postPerformanceReview = postPerformanceReview;
exports.postSecurityReview = postSecurityReview;
exports.postSyntaxReview = postSyntaxReview;
exports.postOverallReview = postOverallReview;
exports.postOwaspReview = postOwaspReview;
exports.postCyclometricCXReview = postCyclometricCXReview;
exports.postOrgStdReview = postOrgStdReview;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../auth/config");
const apiHeaders_1 = require("../../auth/apiHeaders");
async function postReviewCode(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/code`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data; //.reviewComments;
}
async function postPerformanceReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/performance`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postSecurityReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/security`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postSyntaxReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/syntax`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postOverallReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/overall`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postOwaspReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/owasp`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postCyclometricCXReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/cyclometric-cx`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
async function postOrgStdReview(code, language, authToken) {
    const response = await axios_1.default.post(`${config_1.BASE_API}/review/org-std-review`, { code, language }, {
        headers: (0, apiHeaders_1.getAuthHeaders)(authToken),
    });
    return response.data;
}
//# sourceMappingURL=reviewAPI.js.map