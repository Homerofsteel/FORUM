import cookieParser from 'cookie-parser';

export function setCookie(res, name, value, options = {}) {
  res.cookie(name, value, options);
}

export function getCookie(req, name) {
  return req.cookies[name];
}

export function clearCookie(res, name) {
  res.clearCookie(name);
}

export { cookieParser };