"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsRedirect = httpsRedirect;
function httpsRedirect(req, res, next) {
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
        return next();
    }
    return res.redirect(`https://${req.headers.host}${req.url}`);
}
//# sourceMappingURL=https.middleware.js.map