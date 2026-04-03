// api/server.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * POST /api/submit-form
 * Receives form data and forwards to Zapier webhook
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('=== FORM SUBMISSION RECEIVED ===');
    const formData = req.body;
    console.log('Email:', formData.email);
    console.log('Income:', formData.monthlyIncome);

    // Validate required fields
    if (!formData.email || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.currentSavings) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    console.log('✅ Validation passed');

    // Forward to Zapier webhook
    const zapierUrl = 'https://hooks.zapier.com/hooks/catch/3435365/unjpkgc/';
    console.log('📡 Sending to Zapier:', zapierUrl);

    const zapierPayload = {
      email: formData.email || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      monthlyIncome: formData.monthlyIncome || '',
      monthlyExpenses: formData.monthlyExpenses || '',
      currentSavings: formData.currentSavings || '',
      debt: formData.debt || '0',
      incomeStreams: formData.incomeStreams || '',
      financialGoal: formData.financialGoal || '',
      timeframe: formData.timeframe || '',
      investmentExperience: formData.investmentExperience || '',
      riskTolerance: formData.riskTolerance || '',
      submittedAt: new Date().toISOString()
    };

    console.log('📦 Payload:', JSON.stringify(zapierPayload).substring(0, 200) + '...');

    try {
      const zapierResponse = await fetch(zapierUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(zapierPayload),
        timeout: 10000
      });

      console.log('✅ Zapier response status:', zapierResponse.status);

      // We don't care if Zapier fails - still return success to user
      // because the form was received
    } catch (zapierError) {
      console.error('⚠️ Zapier call failed:', zapierError.message);
      // Continue anyway - don't fail the user's form submission
    }

    // ALWAYS return success to frontend
    console.log('✅ Returning success to frontend');
    return res.json({
      success: true,
      message: 'Form received successfully',
      contactId: `contact_${Date.now()}`,
      email: formData.email
    });

  } catch (err) {
    console.error('❌ FATAL ERROR:', err.message);
    console.error('Stack:', err.stack);
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

/**
 * GET /api/status
 * Health check
 */
app.get('/api/status', (req, res) => {
  return res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    message: 'Financial Freedom Analyzer API'
  });
});

/**
 * Default export for Vercel
 */
module.exports = app;
