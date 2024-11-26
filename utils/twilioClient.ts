
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = twilio(accountSid, authToken);

export const sendMessage = async (to: string, body: string) => {
  try {
    const message = await twilioClient.messages.create({
      body,
      from: twilioPhone,
      to,
    });
    console.log('Message sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
