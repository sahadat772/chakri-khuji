import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import connectDB from '@/app/lib/mongodb';
import Application from '@/app/models/Application';
import { sendStatusUpdateEmail } from '@/app/lib/mail';

export const runtime = 'nodejs';

export async function PATCH(req, { params }) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const { status } = await req.json();

        const app = await Application.findByIdAndUpdate(
            params.id,
            { status, reviewedAt: new Date() },
            { new: true }
        ).populate('candidate', 'name email').populate('job', 'title');

        await sendStatusUpdateEmail({
            candidateEmail: app.candidate.email,
            jobTitle: app.job.title,
            status,
        });

        return NextResponse.json({ application: app });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}