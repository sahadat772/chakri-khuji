import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import connectDB from '@/app/lib/mongodb';
import Job from '@/app/models/Job';

export const runtime = 'nodejs';

export async function GET(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'company') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const jobs = await Job.find({ company: session.user.id }).sort({ createdAt: -1 });
        return NextResponse.json({ jobs });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}