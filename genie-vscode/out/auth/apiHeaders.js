"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthHeaders = getAuthHeaders;
function getAuthHeaders(authToken) {
    return {
        Authorization: `Bearer ${authToken}`,
    };
}
//# sourceMappingURL=apiHeaders.js.map