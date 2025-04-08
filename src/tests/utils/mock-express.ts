import { Request, Response, NextFunction } from 'express';

/**
 * Creates a mock Request object
 */
export const mockRequest = (): Partial<Request> => {
  return {
    query: {},
    params: {},
    body: {},
    headers: {},
    cookies: {},
    signedCookies: {},
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    get: jest.fn(),
    header: jest.fn(),
    is: jest.fn(),
    protocol: 'http',
    secure: false,
    ip: '127.0.0.1',
    ips: ['127.0.0.1'],
    subdomains: [],
    path: '/',
    hostname: 'localhost',
    host: 'localhost:3000',
    fresh: false,
    stale: true,
    xhr: false,
    method: 'GET',
    originalUrl: '/',
    url: '/',
    baseUrl: '/',
  };
};

/**
 * Creates a mock Response object
 */
export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

/**
 * Creates a mock NextFunction
 */
export const mockNext = (): jest.Mock => {
  return jest.fn();
};

/**
 * Error handler middleware
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
}; 