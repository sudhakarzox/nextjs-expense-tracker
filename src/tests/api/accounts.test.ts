// tests/api/account.test.ts

import { POST, GET } from '@/app/api/accounts/route';
import Account from '@/models/account';
import { connectDB } from '@/lib/db';

// Mock dependencies
jest.mock('@/models/account');
jest.mock('@/lib/db');
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));


// Helper to mock req.json()
function mockRequest(body: unknown) {
  return { json: async () => body } as Request;
}

describe('/api/account API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should create an account and return 201 with data', async () => {
      // Arrange
      const accountData = { name: 'Cash', balance: 1000 };
      (Account.create as jest.Mock).mockResolvedValue(accountData);

      // Act
      const res = await POST(mockRequest(accountData));
      const json = await res.json();

      // Assert
      expect(connectDB).toHaveBeenCalled();
      expect(Account.create).toHaveBeenCalledWith(accountData);
      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(accountData);
    });

    it('should return 500 on error', async () => {
      (Account.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await POST(mockRequest({ name: 'Cash', balance: 1000 }));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });

  describe('GET', () => {
    it('should return all accounts and 200', async () => {
      const accountsList = [
        { name: 'Cash', balance: 1000 },
        { name: 'Bank', balance: 5000 },
      ];
      (Account.find as jest.Mock).mockResolvedValue(accountsList);

      const res = await GET();
      const json = await res.json();

      expect(connectDB).toHaveBeenCalled();
      expect(Account.find).toHaveBeenCalledWith({});
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(accountsList);
    });

    it('should handle errors on GET with 500', async () => {
      (Account.find as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });
});
