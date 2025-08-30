// tests/api/category.test.ts

import { POST, GET } from '@/app/api/categories/route';
import Category from '@/models/Category';
import { connectDB } from '@/lib/db';

jest.mock('@/models/Category');
jest.mock('@/lib/db');
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

function mockRequest(body: unknown) {
  return { json: async () => body } as Request;
}

describe('/api/category API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('creates a category and returns 201 with data', async () => {
      const categoryData = { name: 'Food' };
      (Category.create as jest.Mock).mockResolvedValue(categoryData);

      const res = await POST(mockRequest(categoryData));
      const json = await res.json();

      expect(connectDB).toHaveBeenCalled();
      expect(Category.create).toHaveBeenCalledWith(categoryData);
      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(categoryData);
    });

    it('returns 500 on error', async () => {
      (Category.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const res = await POST(mockRequest({ name: 'Food' }));
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });

  describe('GET', () => {
    it('returns all categories with 200', async () => {
      const categoriesList = [
        { name: 'Food' },
        { name: 'Travel' },
      ];
      (Category.find as jest.Mock).mockResolvedValue(categoriesList);

      const res = await GET();
      const json = await res.json();

      expect(connectDB).toHaveBeenCalled();
      expect(Category.find).toHaveBeenCalledWith({});
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toEqual(categoriesList);
    });

    it('returns 500 on error', async () => {
      (Category.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });
});
