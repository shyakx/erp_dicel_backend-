import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getLeaveReport } from '../controllers/report.controller';

// Mock Prisma client
const mockPrismaClient = {
  leave: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0)
  }
};

// Mock request and response
const mockRequest = (query = {}) => ({ query } as Request);
const mockResponse = () => {
  const res = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Leave Report Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  it('should return leave report data', async () => {
    await getLeaveReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle invalid date format', async () => {
    req = mockRequest({ startDate: 'invalid-date' });
    await getLeaveReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle invalid export format', async () => {
    req = mockRequest({ format: 'invalid-format' });
    await getLeaveReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
}); 