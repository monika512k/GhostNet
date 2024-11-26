export const getReminders = async (userId) => {
    try {
      const response = await fetch(`/api/reminder/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ }),
      });

      if (!response.ok) throw new Error('Failed to get reminder');
      
    } catch (error) {
      console.error('Error creating todo:', error);
    } 
  };

 export const createReminder = async (userId, data) => {
    try {
      const response = await fetch(`/api/reminder/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data}),
      });

      if (!response.ok) throw new Error('Failed to create reminder');
      
    } catch (error) {
      console.error('Error creating todo:', error);
    } 
  };