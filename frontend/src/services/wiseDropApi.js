/**
 * Wise Drop API Service
 * Handles all communication with AWS API Gateway backend
 */

// AWS API Gateway endpoint - loaded from environment variable
const API_ENDPOINT = import.meta.env.VITE_API_URL || 'https://yld21dvaua.execute-api.us-east-1.amazonaws.com/advice';

/**
 * Generate groundwater advisory from AI
 * @param {Object} params - Request parameters
 * @param {string} params.role - User role: 'farmer', 'officer', or 'policymaker'
 * @param {string} params.state - State name
 * @param {string} params.district - District name
 * @returns {Promise<Object>} Advisory response with advice text
 */
export async function generateAdvisory({ role, state, district }) {
  // Validate inputs
  if (!state || !district) {
    throw new Error('State and district are required');
  }

  // Prepare request payload
  const payload = {
    role: role.toLowerCase(), // Ensure lowercase for backend compatibility
    state: state.trim(),
    district: district.trim(),
  };

  // Debug: Log outgoing request
  console.log('🚀 Sending request to AWS API Gateway:');
  console.log('Endpoint:', API_ENDPOINT);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Debug: Log response status
    console.log('📥 Response status:', response.status);

    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (parseError) {
        console.error('❌ Could not parse error response');
      }
      
      throw new Error(errorMessage);
    }

    // Parse and return the response
    const data = await response.json();
    console.log('✅ Success! Received advisory:', data);
    return data;
    
  } catch (error) {
    // Network errors or parsing errors
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    console.error('❌ API Error:', error);
    throw error;
  }
}
