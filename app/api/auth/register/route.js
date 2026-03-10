import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb'; // '@/app/lib' না হয়ে শুধু '@/lib' হবে
import User from '@/models/User';    // '@/models' ব্যবহার করা সহজ

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();

        // ১. ফিল্ড ভ্যালিডেশন
        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        await connectDB();

        // ২. ইমেইল চেক
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
        }

        // ৩. ইউনিক ইউজারনেম জেনারেশন
        let username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let isUnique = false;
        let finalUsername = username;

        // চেক করা যাতে ডুপ্লিকেট ইউজারনেম না হয়
        while (!isUnique) {
            finalUsername = username + Math.floor(Math.random() * 9999);
            const checkUser = await User.findOne({ username: finalUsername });
            if (!checkUser) isUnique = true;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // ৪. ইউজার তৈরি
        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            username: finalUsername,
        });

        return NextResponse.json({ message: 'Account created successfully!' }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ message: 'Server error: ' + error.message }, { status: 500 });
    }
}