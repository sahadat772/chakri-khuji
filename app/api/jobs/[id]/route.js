import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export const runtime = 'nodejs';

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        await connectDB();

        const job = await Job.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { returnDocument: 'after' }
        ).populate('company', 'name companyName companyLogo companyWebsite location');

        if (!job) return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ job });
    } catch (error) {
        console.error('Job GET error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(req, context) {
    try {
        const { id } = await context.params;
        await connectDB();
        const body = await req.json();
        const job = await Job.findByIdAndUpdate(id, body, { returnDocument: 'after' });
        return NextResponse.json({ job });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        await connectDB();
        await Job.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}