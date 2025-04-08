import { Request, Response } from 'express';
import { getLeaveReport } from '../controllers/report.controller';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    leave: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          employeeId: 'emp1',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-05'),
          type: 'ANNUAL',
          status: 'PENDING',
          employee: {
            user: {
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        }
      ]),
      count: jest.fn().mockResolvedValue(1)
    }
  }))
}));

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
    jest.clearAllMocks();
  });

  it('should return leave report data with proper structure', async () => {
    await getLeaveReport(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          employeeId: expect.any(String),
          startDate: expect.any(String),
          endDate: expect.any(String),
          type: expect.any(String),
          status: expect.any(String),
          employee: expect.objectContaining({
            user: expect.objectContaining({
              firstName: expect.any(String),
              lastName: expect.any(String)
            })
          })
        })
      ])
    );
  });

  it('should handle date range filtering', async () => {
    req = mockRequest({
      startDate: '2024-03-01',
      endDate: '2024-03-31'
    });
    await getLeaveReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle status filtering', async () => {
    req = mockRequest({ status: 'PENDING' });
    await getLeaveReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle invalid date format', async () => {
    req = mockRequest({ startDate: 'invalid-date' });
    await getLeaveReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
        error: expect.any(String)
      })
    );
  });

  it('should handle invalid export format', async () => {
    req = mockRequest({ format: 'invalid-format' });
    await getLeaveReport(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
        error: expect.any(String)
      })
    );
  });

  it('should handle successful export format', async () => {
    req = mockRequest({ format: 'csv' });
    await getLeaveReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });
}); 