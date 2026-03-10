import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email error:', error);
  }
}

export async function sendApplicationEmail({ candidateName, jobTitle, companyEmail }) {
  await sendEmail({
    to: companyEmail,
    subject: 'New Application: ' + jobTitle,
    html: '<h2>New Job Application</h2><p><strong>' + candidateName + '</strong> has applied for <strong>' + jobTitle + '</strong>.</p><p>Login to your dashboard to review the application.</p>',
  });
}

export async function sendStatusUpdateEmail({ candidateEmail, jobTitle, status }) {
  const statusMessages = {
    reviewed: 'Your application is being reviewed.',
    shortlisted: 'Congratulations! You have been shortlisted.',
    accepted: 'Congratulations! Your application has been accepted!',
    rejected: 'Unfortunately, your application was not selected this time.',
  };

  await sendEmail({
    to: candidateEmail,
    subject: 'Application Update: ' + jobTitle,
    html: '<h2>Application Status Update</h2><p>Your application for <strong>' + jobTitle + '</strong> has been updated.</p><p><strong>Status:</strong> ' + status.toUpperCase() + '</p><p>' + (statusMessages[status] || '') + '</p>',
  });
}
