import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Job from '@/app/models/Job';
import { auth } from '@/app/lib/auth';

export const runtime = 'nodejs';

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category') || '';
        const jobType = searchParams.get('jobType') || '';
        const locationType = searchParams.get('locationType') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10;

        const query = { isActive: true };
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ];
        }
        if (category) query.category = category;
        if (jobType) query.jobType = jobType;
        if (locationType) query.locationType = locationType;

        const total = await Job.countDocuments(query);
        const jobs = await Job.find(query)
            .populate('company', 'name companyName companyLogo')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({ jobs, total, pages: Math.ceil(total / limit), page });
    } catch (error) {
        console.error('Jobs GET error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'company') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const job = await Job.create({ ...body, company: session.user.id });
        return NextResponse.json({ job }, { status: 201 });
    } catch (error) {
        console.error('Jobs POST error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}