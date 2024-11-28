"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeUrl = exports.BASE_API = void 0;
exports.BASE_API = "http://localhost:2000";
const exchangeUrl = (userUrl) => {
    exports.BASE_API = userUrl;
};
exports.exchangeUrl = exchangeUrl;
//# sourceMappingURL=config.js.map