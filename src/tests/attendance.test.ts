import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAttendanceReport } from '../controllers/report.controller';

// Mock Prisma client
const mockPrismaClient = {
  attendance: {
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

describe('Attendance Report Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  it('should return attendance report data', async () => {
    await getAttendanceReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle invalid date format', async () => {
    req = mockRequest({ startDate: 'invalid-date' });
    await getAttendanceReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle invalid export format', async () => {
    req = mockRequest({ format: 'invalid-format' });
    await getAttendanceReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
}); 