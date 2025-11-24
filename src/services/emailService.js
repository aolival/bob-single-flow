/**
 * Email Service for BoB Single Flow
 * Communicates with the shared BoB Email Service (port 3001)
 */

const EMAIL_SERVICE_URL = 'http://localhost:3001';

/**
 * Send a demo notification email
 * @param {string} action - The action that occurred
 * @param {object} details - Additional details about the action
 * @param {string} to - Recipient email (optional, defaults to demo email)
 * @returns {Promise<object>} Response from email service
 */
export async function sendDemoNotification(action, details = {}, to = null) {
  try {
    const response = await fetch(`${EMAIL_SERVICE_URL}/send-demo-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'Single Flow BoB',
        action,
        details,
        ...(to && { to }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email notification');
    }

    return data;
  } catch (error) {
    console.error('Email notification failed:', error);
    throw error;
  }
}

/**
 * Send a custom email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text fallback (optional)
 * @returns {Promise<object>} Response from email service
 */
export async function sendCustomEmail(to, subject, html, text = null) {
  try {
    const response = await fetch(`${EMAIL_SERVICE_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        ...(text && { text }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

/**
 * Check if email service is healthy
 * @returns {Promise<boolean>}
 */
export async function checkEmailService() {
  try {
    const response = await fetch(`${EMAIL_SERVICE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Email service health check failed:', error);
    return false;
  }
}
