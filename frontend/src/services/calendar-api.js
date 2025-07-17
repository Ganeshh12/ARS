// Calendar API service for frontend
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const calendarApi = {
  // Get all calendar events with optional filters
  getEvents: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.academicYear) queryParams.append('academicYear', filters.academicYear);
      if (filters.eventType) queryParams.append('eventType', filters.eventType);
      if (filters.month !== undefined) queryParams.append('month', filters.month);
      if (filters.studentYear) queryParams.append('studentYear', filters.studentYear);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/calendar/events${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const events = await response.json();
      
      // Ensure dates are properly parsed
      return events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },
  
  // Create a new calendar event
  createEvent: async (eventData) => {
    try {
      const response = await fetch(`${API_URL}/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const event = await response.json();
      
      // Ensure dates are properly parsed
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },
  
  // Update an existing calendar event
  updateEvent: async (id, eventData) => {
    try {
      const response = await fetch(`${API_URL}/calendar/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const event = await response.json();
      
      // Ensure dates are properly parsed
      return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      };
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  },
  
  // Delete a calendar event
  deleteEvent: async (id) => {
    try {
      const response = await fetch(`${API_URL}/calendar/events/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
};

export default calendarApi;