// tests/api/debtor.test.ts

import { POST, GET } from '@/app/api/debtors/route'; 
import Debtor from '@/models/Debtor';
import { connectDB } from '@/lib/db';

jest.mock('@/models/Debtor');
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));


function mockRequest(body: unknown) {
  return { json: async () => body } as Request;
}

describe('/api/debtor API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('creates a debtor and returns 201 with data', async () => {
      const debtorData = { name: 'John Doe' };
      (Debtor.create as jest.Mock).mockResolvedValue(debtorData);

      const res = await POST(mockRequest(debtorData));
      const json = await res.json();

      expect(connectDB).toHaveBeenCalled();
      expect(Debtor.create).toHaveBeenCalledWith(debtorData);
      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(debtorData);
    });

    it('returns 500 if debtor not created', async () => {
      (Debtor.create as jest.Mock).mockResolvedValue(null);

      const res = await POST(mockRequest({ name: 'John Doe' }));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.message).toMatch(/not created/i);
    });

    it('handles error and returns 500', async () => {
      (Debtor.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const res = await POST(mockRequest({ name: 'John Doe' }));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });

  describe('GET', () => {
    it('returns all debtors with 200', async () => {
      const debtorsList = [
        { name: 'John Doe' },
        { name: 'Jane Smith' },
      ];
      (Debtor.find as jest.Mock).mockResolvedValue(debtorsList);

      const res = await GET();
      const json = await res.json();

      expect(connectDB).toHaveBeenCalled();
      expect(Debtor.find).toHaveBeenCalledWith({});
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(debtorsList);
    });

    it('handles error on GET with 500', async () => {
      (Debtor.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });
});
