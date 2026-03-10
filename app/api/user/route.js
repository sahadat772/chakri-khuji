import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function PATCH(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const body = await req.json();

        const allowedFields = ['name', 'bio', 'phone', 'location', 'image', 'resume',
            'skills', 'companyName', 'companyLogo', 'companyWebsite', 'companySize'];

        const updateData = {};
        allowedFields.forEach(function (field) {
            if (body[field] !== undefined) updateData[field] = body[field];
        });

        const user = await User.findByIdAndUpdate(
            session.user.id,
            updateData,
            { returnDocument: 'after' }
        );

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const user = await User.findById(session.user.id);
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}