import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import connectDB from '@/app/lib/mongodb';
import Application from '@/app/models/Application';
import Job from '@/app/models/Job';
// import User from '@/app/models/User';
import { sendApplicationEmail } from '../../lib/mail';

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        if (session.user.role !== 'candidate') return NextResponse.json({ message: 'Only candidates can apply' }, { status: 403 });

        await connectDB();
        const { jobId, coverLetter, expectedSalary } = await req.json();

        const job = await Job.findById(jobId).populate('company', 'email name companyName');
        if (!job || !job.isActive) return NextResponse.json({ message: 'Job not found or inactive' }, { status: 404 });

        const existing = await Application.findOne({ job: jobId, candidate: session.user.id });
        if (existing) return NextResponse.json({ message: 'You have already applied for this job' }, { status: 400 });

        await Application.create({
            job: jobId,
            candidate: session.user.id,
            coverLetter,
            expectedSalary: expectedSalary || undefined,
        });

        await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

        await sendApplicationEmail({
            candidateName: session.user.name,
            jobTitle: job.title,
            companyEmail: job.company.email,
        });

        return NextResponse.json({ message: 'Application submitted!' }, { status: 201 });
    } catch (error) {
        console.error('Apply error:', error);
        if (error.code === 11000) return NextResponse.json({ message: 'You have already applied for this job' }, { status: 400 });
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}