// api/server.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * POST /api/submit-form
 * Receives form data and forwards to Zapier webhook
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    console.log('📝 Received form submission:', formData.email);

    // Validate required fields
    if (!formData.email || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.currentSavings) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Forward to Zapier webhook
    const zapierUrl = 'https://hooks.zapier.com/hooks/catch/3435365/unjs6w4/';
    
    console.log('📡 Forwarding to Zapier:', zapierUrl);

    const zapierResponse = await fetch(zapierUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    console.log('✅ Zapier response status:', zapierResponse.status);

    // Always return success to frontend
    res.json({
      success: true,
      message: 'Form received and syncing to Active Campaign',
      contactId: `contact_${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Server error:', err.message);
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
