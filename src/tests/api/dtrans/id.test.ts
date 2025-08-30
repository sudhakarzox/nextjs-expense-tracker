import { GET } from '@/app/api/dtrans/[id]/route';
import DTrans from '@/models/DTrans';
import { connectDB } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));
jest.mock('@/models/DTrans');
jest.mock('@/models/transaction');
jest.mock('@/models/Category');

describe('/api/dtrans/[id] GET API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return transactions for a valid debtor id', async () => {
    const mockTransactions = [
      {
        transaction: {
          _id: 'trans1',
          amount: 100,
          category: { _id: 'cat1', name: 'Food' },
        },
      },
    ];

    const mockDTrans = {
      transactions: mockTransactions,
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockTransactions),
    };

    // Mock the chained populate calls and exec to finally return the mocked object
    (DTrans.findOne as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockDTrans),
    });

    // Simulate context.params resolving with debtor id
    const context = { params: Promise.resolve({ id: 'debtor123' }) };

    const req = {} as Request;
    const response = await GET(req, context);
    const json = await response.json();

    expect(connectDB).toHaveBeenCalled();
    expect(DTrans.findOne).toHaveBeenCalledWith({ debtor: 'debtor123' });
    expect(json.transactions).toBeDefined();
  });

  it('should return empty transactions array if no DTrans found', async () => {
    (DTrans.findOne as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    const context = { params: Promise.resolve({ id: 'debtor123' }) };
    const req = {} as Request;

    const response = await GET(req, context);
    const json = await response.json();

    expect(json.transactions).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    (DTrans.findOne as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('DB Failure')),
    });

    const context = { params: Promise.resolve({ id: 'debtor123' }) };
    const req = {} as Request;

    const response = await GET(req, context);
    const json = await response.json();

    expect(json.error).toBe('Failed to fetch transactions');
    expect(response.status).toBe(500);
  });
});
