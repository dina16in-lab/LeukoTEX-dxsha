export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, email, projectType, description, budget } = body;

    if (!name || !email || !description) {
      return res.status(400).json({ detail: 'Name, email, and description are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ detail: 'Please enter a valid email address.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'LEUKOTEX Inquiries <onboarding@resend.dev>';
    const emailTo = process.env.EMAIL_TO || 'dina16in@gmail.com';

    if (!resendApiKey) {
      return res.status(500).json({
        detail: 'RESEND_API_KEY is not configured in Vercel Environment Variables. Please set it in Vercel Settings -> Environment Variables.',
      });
    }

    const subject = `New LEUKOTEX Project Inquiry — ${projectType || 'General Scope'}`;
    const timestamp = new Date().toISOString();

    const textContent = `LEUKOTEX — New Project Inquiry

Submitted: ${timestamp}

Customer Details:
- Name: ${name}
- Email: ${email}

Project Scope:
- Project Type: ${projectType || 'N/A'}
- Budget Tier: ${budget || 'N/A'}

Project Description:
${description}
`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f17;
      color: #e2e8f0;
      margin: 0;
      padding: 24px;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1f293d;
      border-radius: 12px;
      padding: 32px;
    }
    .header {
      border-bottom: 1px solid #1f293d;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      color: #99FF99;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 600;
      margin-top: 6px;
    }
    .field {
      margin-bottom: 16px;
    }
    .label {
      color: #94a3b8;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .value {
      color: #ffffff;
      font-size: 15px;
    }
    .desc-box {
      background-color: #0d131f;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 16px;
      margin-top: 8px;
      color: #e2e8f0;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .meta {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #1f293d;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">LEUKOTEX</div>
      <div class="title">New Project Inquiry</div>
    </div>
    <div class="field">
      <div class="label">Customer Name</div>
      <div class="value">${name}</div>
    </div>
    <div class="field">
      <div class="label">Customer Email</div>
      <div class="value"><a href="mailto:${email}" style="color: #99FF99;">${email}</a></div>
    </div>
    <div class="field">
      <div class="label">Project Type</div>
      <div class="value">${projectType || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="label">Budget Tier</div>
      <div class="value">${budget || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="label">Project Description</div>
      <div class="desc-box">${description}</div>
    </div>
    <div class="meta">
      <div>Submitted: ${timestamp}</div>
    </div>
  </div>
</body>
</html>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        reply_to: email,
        subject,
        text: textContent,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend error:', errorText);
      return res.status(502).json({
        detail: 'Failed to deliver email through Resend: ' + errorText,
      });
    }

    const data = await resendResponse.json();
    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been received. Our studio will connect with you within 24 hours.',
      inquiry_id: data.id,
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return res.status(500).json({
      detail: err.message || 'Internal server error while processing inquiry.',
    });
  }
}
