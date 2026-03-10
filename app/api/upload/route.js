import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file');
        const type = formData.get('type'); // 'avatar', 'resume', 'logo'

        if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const base64 = buffer.toString('base64');
        const dataUri = 'data:' + file.type + ';base64,' + base64;

        const folder = type === 'resume' ? 'chakri/resumes' : 'chakri/images';
        const resourceType = type === 'resume' ? 'raw' : 'image';

        const result = await cloudinary.uploader.upload(dataUri, {
            folder,
            resource_type: resourceType,
            public_id: session.user.id + '_' + type + '_' + Date.now(),
        });

        return NextResponse.json({ url: result.secure_url }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}