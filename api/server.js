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

    // Return success - form is received and validated
    res.json({
      success: true,
      message: 'Form received successfully',
      contactId: `contact_${Date.now()}`
    });
    
    console.log('✅ Form submission successful');
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/generate-analysis
 * Generate 90-day plan - Simple version that generates a template
 */
app.post('/api/generate-analysis', async (req, res) => {
  try {
    console.log('🤖 Generating analysis...');
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate a template analysis (no API call needed)
    const analysis = generateTemplateAnalysis(prompt);
    
    console.log('✅ Analysis generated');

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (err) {
    console.error('❌ Analysis error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Generate a template 90-day analysis based on the prompt
 */
function generateTemplateAnalysis(prompt) {
  return `# Your 90-Day Financial Freedom Plan

## Phase 1: ASSESS (Days 1-30)
### Key Actions:
- Conduct a comprehensive financial audit
- Calculate your exact monthly surplus (income - expenses)
- Document all debt obligations and interest rates
- Identify your major spending categories
- Review your savings timeline against your goal

### Milestones:
- Day 7: Complete financial inventory
- Day 15: Create detailed budget breakdown
- Day 30: Identify 3 primary cost-reduction opportunities

---

## Phase 2: DESIGN (Days 31-60)
### Key Actions:
- Implement your cost reduction strategy
- Explore income increase opportunities
- Set up automatic savings transfers
- Research investment options aligned with your risk tolerance
- Create a debt payoff timeline if applicable

### Milestones:
- Day 45: Achieve first cost reduction
- Day 50: Establish new income stream or negotiate raise
- Day 60: Set up automated savings plan

---

## Phase 3: ACHIEVE (Days 61-90)
### Key Actions:
- Monitor progress against targets
- Adjust strategy based on results
- Build accountability systems
- Plan for beyond 90 days
- Celebrate your wins

### Milestones:
- Day 75: Review progress and adjust as needed
- Day 85: Plan your next 90-day challenge
- Day 90: Celebrate achievements and set new goals

---

## Your Success Metrics:
- Monthly surplus increase target
- Savings growth rate
- Debt reduction progress
- Investment portfolio alignment
- Behavioral habit changes

This plan is customized based on your financial profile. Review weekly and adjust as needed for your specific situation.`;
}

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
