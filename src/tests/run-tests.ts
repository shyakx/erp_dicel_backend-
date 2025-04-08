import { getAttendanceReport, getLeaveReport, getPayrollReport, getIncidentReport, getEquipmentReport, getProjectReport } from '../controllers/report.controller';
import { Request, Response } from 'express';
import { mockRequest, mockResponse, mockNext } from './utils/mock-express';

// Mock Prisma client
const mockPrismaClient = {
  attendance: {
    findMany: async () => [],
    count: async () => 0
  },
  leave: {
    findMany: async () => [],
    count: async () => 0
  },
  payroll: {
    findMany: async () => [],
    count: async () => 0
  },
  incident: {
    findMany: async () => [],
    count: async () => 0
  },
  equipment: {
    findMany: async () => [],
    count: async () => 0
  },
  project: {
    findMany: async () => [],
    count: async () => 0
  }
};

// Mock export utils
const mockHandleExport = async () => undefined;

// Override the imports in the controller
// This is a hacky way to mock dependencies without using Jest
(global as any).PrismaClient = class {
  constructor() {
    return mockPrismaClient;
  }
};

// Simple mock functions
const mockRequest = (query = {}) => ({ query } as Request);
const mockResponse = () => {
  const res = {} as Response;
  res.json = (data: any) => {
    console.log('Response:', JSON.stringify(data, null, 2));
    return res;
  };
  res.status = (code: number) => {
    console.log(`Status: ${code}`);
    return res;
  };
  return res;
};
const mockNext = (error: any) => {
  if (error) console.error('Error:', error);
};

// Test function
async function runTests() {
  console.log('Running report controller tests...\n');

  try {
    // Test attendance report
    console.log('Testing attendance report...');
    await getAttendanceReport(mockRequest(), mockResponse());
    
    // Test leave report
    console.log('\nTesting leave report...');
    await getLeaveReport(mockRequest(), mockResponse());
    
    // Test payroll report
    console.log('\nTesting payroll report...');
    await getPayrollReport(mockRequest(), mockResponse());
    
    // Test incident report
    console.log('\nTesting incident report...');
    await getIncidentReport(mockRequest(), mockResponse());
    
    // Test equipment report
    console.log('\nTesting equipment report...');
    await getEquipmentReport(mockRequest(), mockResponse());
    
    // Test project report
    console.log('\nTesting project report...');
    await getProjectReport(mockRequest(), mockResponse());
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();

describe('Report Controller Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    mockReq = {
      query: {}
    };
    jest.clearAllMocks();
  });

  describe('getAttendanceReport', () => {
    it('should return attendance data when valid parameters are provided', async () => {
      mockReq.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        format: 'json'
      };
      await getAttendanceReport(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });
}); 