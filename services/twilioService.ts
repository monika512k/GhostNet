import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, message: string) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    });
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error };
  }
};
