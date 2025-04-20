import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params:  Promise<{ id: string }> }) {
  await connectDB();
  const update = await req.json();
  const { id } = await params;
  const transaction = await Transaction.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ success: true, data: transaction });
}

export async function DELETE(_req: Request, { params }: { params:  Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: 'Transaction deleted' });
}
