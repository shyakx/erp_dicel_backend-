import { Request, Response } from 'express';
import { getAttendanceReport } from '../controllers/report.controller';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    attendance: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          employeeId: 'emp1',
          checkIn: new Date('2024-03-01T09:00:00'),
          checkOut: new Date('2024-03-01T17:00:00'),
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

describe('Attendance Report Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('should return attendance report data with proper structure', async () => {
    await getAttendanceReport(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          employeeId: expect.any(String),
          checkIn: expect.any(String),
          checkOut: expect.any(String),
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
    await getAttendanceReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle invalid date format', async () => {
    req = mockRequest({ startDate: 'invalid-date' });
    await getAttendanceReport(req, res);
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
    await getAttendanceReport(req, res);
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
    await getAttendanceReport(req, res);
    expect(res.json).toHaveBeenCalled();
  });
}); 