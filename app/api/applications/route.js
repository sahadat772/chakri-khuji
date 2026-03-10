import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import connectDB from '@/app/lib/mongodb';
import Application from '@/app/models/Application';

export const runtime = 'nodejs';

export async function GET(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId');

        let query = {};
        if (session.user.role === 'candidate') {
            query.candidate = session.user.id;
        } else if (session.user.role === 'company' && jobId) {
            query.job = jobId;
        }

        const applications = await Application.find(query)
            .populate('job', 'title company')
            .populate('candidate', 'name email username')
            .sort({ createdAt: -1 });

        return NextResponse.json({ applications });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}