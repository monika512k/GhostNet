export const validatePhoneNumber = (phone: string) => {
    // Basic E.164 format validation
    const phoneRegex = /^\+[1-9]\d{10,14}$/;
    return phoneRegex.test(phone);
  };
  