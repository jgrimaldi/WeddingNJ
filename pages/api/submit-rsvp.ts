import type { NextApiRequest, NextApiResponse } from 'next';
import type { GuestResponse } from '../../components/RsvpForm';

interface RsvpSubmission {
  guestResponses: GuestResponse[];
  extras: {
    requireTransportation?: boolean;
    email: string;
  };
}

interface ApiResponse {
  success?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { GOOGLE_APPS_SCRIPT_URL, GOOGLE_APPS_SCRIPT_SECRET } = process.env;

  if (!GOOGLE_APPS_SCRIPT_URL || !GOOGLE_APPS_SCRIPT_SECRET) {
    console.error('Missing Google Apps Script environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const submission: RsvpSubmission = req.body;

    // Validate the submission
    if (!submission.extras?.email || !submission.guestResponses?.length) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }

    console.log('Submitting RSVP to Google Sheets:', {
      email: submission.extras.email,
      guestCount: submission.guestResponses.length,
      timestamp: new Date().toISOString()
    });

    // Send to Google Apps Script with authentication
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Key': GOOGLE_APPS_SCRIPT_SECRET,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: submission.extras.email,
        requireTransportation: submission.extras.requireTransportation || false,
        guests: submission.guestResponses.map(guest => ({
          name: guest.name,
          selectedEvents: guest.selectedEvents,
          dietaryNotes: guest.note || ''
        })),
        // Add request origin for additional verification
        origin: req.headers.origin || 'unknown'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script error:', errorText);
      throw new Error(`Google Apps Script returned ${response.status}`);
    }

    const result = await response.text();
    console.log('Google Apps Script response:', result);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit RSVP. Please try again or contact us directly.' 
    });
  }
}
