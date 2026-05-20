import { Request, Response, NextFunction } from "express";

export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    return next();
  }

  return res.redirect(`https://${req.headers.host}${req.url}`);
}
