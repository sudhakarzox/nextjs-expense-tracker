import { connectDB } from '@/lib/db';
import Account from '@/models/account';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, balance } = await req.json();

    const account = await Account.create({ name, balance });
    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find({});
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}