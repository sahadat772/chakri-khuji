import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function GET(req) {
    try {
        await connectDB();
        const companies = await User.find({ role: 'company' })
            .select('name companyName companyLogo companySize location bio companyWebsite')
            .sort({ createdAt: -1 });
        return NextResponse.json({ companies });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}