import { connectDB } from '@/lib/db';
import Debtor from '@/models/Debtor';
// import DTrans from '@/models/DTrans';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name } = await req.json();

    const debtor = await Debtor.create({ name });

    if (!debtor) {
      return NextResponse.json({ success: false, message: 'Debtor not created' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: debtor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const debtors = await Debtor.find({});
    return NextResponse.json({ success: true, data: debtors });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
