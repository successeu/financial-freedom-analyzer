// api/server.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * POST /api/submit-form
 * Receives form data and syncs to Active Campaign
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('📝 Step 1: Received form submission');
    const formData = req.body;
    console.log('📝 Step 2: Form data:', {
      email: formData.email,
      income: formData.monthlyIncome,
      expenses: formData.monthlyExpenses,
      savings: formData.currentSavings
    });

    // Validate required fields
    if (!formData.email || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.currentSavings) {
      console.log('❌ Step 3: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('✅ Step 4: Validation passed');

    // For now, just return success without calling Claude
    // This lets us test if the backend is working at all
    console.log('✅ Step 5: Returning success');
    
    res.json({
      success: true,
      message: 'Form received and validated',
      contactId: `contact_${Date.now()}`
    });

  } catch (err) {
    console.error('❌ CATCH BLOCK ERROR:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      error: err.message,
      type: 'submit_form_error'
    });
  }
});

/**
 * POST /api/generate-analysis
 * Generate 90-day plan using Claude
 */
app.post('/api/generate-analysis', async (req, res) => {
  try {
    console.log('🤖 Step 1: Generate analysis request received');
    const { prompt } = req.body;

    if (!prompt) {
      console.log('❌ Step 2: No prompt provided');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('✅ Step 3: Prompt received, length:', prompt.length);

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('🔑 Step 4: Checking API key...');
    
    if (!apiKey) {
      console.error('❌ Step 5: ANTHROPIC_API_KEY is NOT set!');
      return res.status(500).json({ 
        error: 'ANTHROPIC_API_KEY not configured',
        type: 'missing_api_key'
      });
    }

    console.log('✅ Step 5: API key found');
    console.log('📡 Step 6: Calling Anthropic API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ 
          role: 'user', 
          content: prompt 
        }]
      })
    });

    console.log('📡 Step 7: API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Step 8: API error response:', errorText);
      return res.status(500).json({ 
        error: `API returned ${response.status}`,
        type: 'anthropic_api_error',
        details: errorText.substring(0, 200)
      });
    }

    const result = await response.json();
    console.log('✅ Step 9: API response parsed');
    
    const analysis = result.content[0]?.text || 'Unable to generate analysis';
    console.log('✅ Step 10: Analysis extracted, length:', analysis.length);

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (err) {
    console.error('❌ CATCH BLOCK ERROR in generate-analysis:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      error: err.message,
      type: 'analysis_error'
    });
  }
});

/**
 * GET /api/status
 * Health check
 */
app.get('/api/status', (req, res) => {
  const apiKeyStatus = process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Not set';
  
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'Financial Freedom Analyzer API',
    apiKey: apiKeyStatus,
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set'
    }
  });
});

/**
 * Default export for Vercel
 */
module.exports = app;
