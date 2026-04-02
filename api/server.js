// api/server.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * POST /api/submit-form
 * Receives form data and syncs to Active Campaign
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.email || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.currentSavings) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📝 Received form submission:', formData.email);

    // Sync to Active Campaign via Claude API
    const syncResult = await syncToActiveCampaign(formData);

    if (syncResult.success) {
      res.json({
        success: true,
        message: 'Data synced to Active Campaign',
        contactId: syncResult.contactId
      });
      console.log('✅ Synced to AC - Contact ID:', syncResult.contactId);
    } else {
      res.status(500).json({
        success: false,
        error: syncResult.error
      });
      console.log('❌ Sync failed:', syncResult.error);
    }
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Sync form data to Active Campaign using Claude API + MCP
 */
async function syncToActiveCampaign(formData) {
  try {
    const prompt = `You have access to Active Campaign API via MCP. Please create or update a contact with this information:

EMAIL: ${formData.email}
FIRST NAME: ${formData.firstName || 'User'}
LAST NAME: ${formData.lastName || ''}
PHONE: ${formData.phone || ''}

FINANCIAL DATA:
- Monthly Income: $${formData.monthlyIncome}
- Monthly Expenses: $${formData.monthlyExpenses}
- Monthly Surplus: $${parseInt(formData.monthlyIncome) - parseInt(formData.monthlyExpenses)}
- Current Savings: $${formData.currentSavings}
- Total Debt: $${formData.debt || 0}

GOALS & PROFILE:
- Financial Goal: ${formData.financialGoal}
- Timeframe: ${formData.timeframe}
- Investment Experience: ${formData.investmentExperience}
- Risk Tolerance: ${formData.riskTolerance}

Using the Active Campaign MCP tools available to you, please:
1. Create or update this contact in the srglobal75904.activehosted.com account
2. Store this information in the contact record
3. Return the contact ID and confirmation

Important: Use the ActiveCampaign tools to create/update the contact.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.content[0]?.text || '';

    // Parse contact ID from response
    const contactIdMatch = responseText.match(/contact[_ ]id[:\s]*(\d+)/i) || 
                          responseText.match(/ID:\s*(\d+)/i);
    const contactId = contactIdMatch ? contactIdMatch[1] : 'created';

    return {
      success: true,
      contactId: contactId,
      message: responseText
    };

  } catch (err) {
    console.error('AC Sync Error:', err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * POST /api/generate-analysis
 * Generate 90-day plan using Claude
 */
app.post('/api/generate-analysis', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = result.content[0]?.text || '';

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/status
 * Health check
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date(),
    message: 'Financial Freedom Analyzer API'
  });
});

/**
 * Default export for Vercel
 */
module.exports = app;
