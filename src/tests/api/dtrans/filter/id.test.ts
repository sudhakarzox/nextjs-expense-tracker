import { GET } from '@/app/api/dtrans/filter/[id]/route';
import DTrans from '@/models/DTrans';
import { connectDB } from '@/lib/db';


jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));
jest.mock('@/models/DTrans');

describe('/api/dtrans/filter/[id] GET route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns filtered transactions for debtor', async () => {
    const debtorId = 'debtor123';

    // Mock DTrans.findOne to return transactions with various types and statuses
    const mockDTrans = {
  _id: 'dtrans1',
  debtor: { _id: 'debtor1', name: 'John Doe' },
  transactions: [
    { creditedTillDate: 258, transaction: { type: 'expense', status: 'pending', amount: 100, date: new Date('2025-01-01'), _id: 't1' } },
    { creditedTillDate: 258, transaction: { type: 'income', status: 'completed', amount: 200, date: new Date('2025-02-01'), _id: 't2' } },
    { creditedTillDate: 258, transaction: { type: 'expense', status: 'open', amount: 300, date: new Date('2025-03-01'), _id: 't3' } },
  ],
};

    (DTrans.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDTrans)
    })

    const context = { params: Promise.resolve({ id: debtorId }) };
    const req = {} as Request;

    const res = await GET(req, context);
    const json = await res.json();

    expect(connectDB).toHaveBeenCalled();
    expect(DTrans.findOne).toHaveBeenCalledWith({ debtor: debtorId });

    // Filtered transactions: only expense with status 'pending' or 'open' (2 transactions)
    expect(json.transactions).toHaveLength(2);
    expect(json.transactions[0]).toMatchObject({
    date: new Date("2025-01-01").toISOString(),
      amount: 100,
      _id: 't1',
    });
    expect(json.transactions[1]).toMatchObject({
        date: new Date("2025-03-01").toISOString(),
      amount: 300,
      _id: 't3',
    });
  });

  it('returns empty array if no DTrans found', async () => {
    (DTrans.findOne as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const context = { params: Promise.resolve({ id: 'nonexistent' }) };
    const req = {} as Request;

    const res = await GET(req, context);
    const json = await res.json();

    expect(json.transactions).toEqual([]);
  });

  it('handles error and returns 500 with error message', async () => {
    (DTrans.findOne as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('DB Failure')),
    });

    const context = { params: Promise.resolve({ id: 'errorid' }) };
    const req = {} as Request;

    const res = await GET(req, context);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Internal Server Error');
  });
});
