import { connectDB } from '@/lib/db';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  try {
    const transaction = await Transaction.findById(id)
      .populate('account')
      .populate('category');
    if (!transaction) {
      return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: transaction }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const update = await req.json();
    const { id } = await params;
    const transaction = await Transaction.findByIdAndUpdate(id, update, { new: true });
    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}