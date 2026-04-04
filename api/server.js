// api/server.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Generate personalized 90-day blueprint
 * Creates unique content based on user's financial profile
 */
function generatePersonalizedPlan(formData) {
  const {
    firstName,
    country,
    currency,
    monthlyIncome,
    monthlyExpenses,
    currentSavings,
    totalDebt,
    financialGoal,
    timeframe,
    investmentExperience,
    riskTolerance
  } = formData;

  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const debtToIncomeRatio = totalDebt / (monthlyIncome || 1);
  const symbol = getCurrencySymbol(currency);

  // Determine financial profile type
  let profileType = 'Balanced';
  const surplusThresholds = getSurplusThresholds(currency);
  
  if (monthlySurplus < surplusThresholds.tight) {
    profileType = 'Tight Budget';
  } else if (monthlySurplus > surplusThresholds.strong) {
    profileType = 'Strong Income';
  }

  // Determine debt status
  let debtStatus = 'Manageable';
  if (debtToIncomeRatio > 3) {
    debtStatus = 'High Debt';
  } else if (totalDebt === 0) {
    debtStatus = 'Debt Free';
  }

  // Determine savings level
  let savingsLevel = 'Starting';
  const savingsThresholds = getSavingsThresholds(currency);
  if (currentSavings >= savingsThresholds.solid) {
    savingsLevel = 'Solid';
  } else if (currentSavings >= savingsThresholds.building) {
    savingsLevel = 'Building';
  }

  // Generate blueprint content
  const blueprint = `
════════════════════════════════════════════════════════════
90-DAY WEALTH BLUEPRINT
${firstName.toUpperCase() || 'VALUED CLIENT'}
════════════════════════════════════════════════════════════

📊 YOUR FINANCIAL SNAPSHOT
──────────────────────────────────────────────────────────
Country:                ${country}
Currency:               ${currency} (${symbol})
Monthly Gross Income:   ${symbol}${formatNumber(monthlyIncome)}
Monthly Expenses:       ${symbol}${formatNumber(monthlyExpenses)}
Monthly Surplus:        ${symbol}${formatNumber(monthlySurplus)}
Current Savings:        ${symbol}${formatNumber(currentSavings)}
Total Debt:             ${symbol}${formatNumber(totalDebt)}
Debt-to-Income Ratio:   ${debtToIncomeRatio.toFixed(2)}x

🎯 YOUR PROFILE
──────────────────────────────────────────────────────────
Financial Situation:    ${profileType}
Debt Status:            ${debtStatus}
Savings Level:          ${savingsLevel}
Primary Goal:           ${financialGoal}
Timeline:               ${timeframe}
Risk Tolerance:         ${riskTolerance}
Investment Experience:  ${investmentExperience}

════════════════════════════════════════════════════════════
PHASE 1: ASSESS (Days 1-7)
════════════════════════════════════════════════════════════

Your Current Position:
${generatePhase1Content(profileType, debtStatus, monthlySurplus, totalDebt, symbol)}

Action Items:
□ Complete detailed expense audit
□ List all debt with interest rates
□ Calculate your actual monthly surplus
□ Document current savings accounts and balances
□ Review your investment experience level

Key Insight:
Your monthly surplus is ${symbol}${formatNumber(Math.abs(monthlySurplus))}. This is the foundation of your wealth-building journey.
${monthlySurplus <= 0 ? 'Your expenses equal or exceed your income - Phase 1 focus: expense reduction.' : 'This is money available to invest in your future.'}

════════════════════════════════════════════════════════════
PHASE 2: DESIGN (Days 8-30)
════════════════════════════════════════════════════════════

Strategy for Your Goal: "${financialGoal}"
Timeline: ${timeframe}

${generatePhase2Content(financialGoal, monthlySurplus, currentSavings, timeframe, symbol)}

Implementation Steps:
${generateImplementationSteps(profileType, financialGoal, riskTolerance)}

════════════════════════════════════════════════════════════
PHASE 3: EXECUTE (Days 31-90)
════════════════════════════════════════════════════════════

Weekly Milestones:
Week 1-2:   Set up automatic transfers and tracking systems
Week 3-4:   Launch first income stream or investment
Week 5-8:   Build momentum and adjust as needed
Week 9-12:  Review progress and plan next 90 days

Success Metrics:
✓ Savings increased: Target ${symbol}${formatNumber(monthlySurplus * 30)}
✓ Debt reduced: Target ${symbol}${formatNumber(totalDebt * 0.1)}
✓ New income stream: Started (if applicable)
✓ Investment account: Opened (if applicable)

════════════════════════════════════════════════════════════
KEY PRINCIPLES (From SpeedWealth)
════════════════════════════════════════════════════════════

1. INCREASE YOUR INCOME
   Your ability to make money is your greatest asset.
   Target: Increase by 10-20% within 90 days.

2. REDUCE YOUR EXPENSES
   Not through deprivation, but through intelligent choices.
   Target: Find ${symbol}${formatNumber(monthlySurplus * 0.2)} in monthly savings.

3. INVEST THE DIFFERENCE
   Money must work for you, not just you for money.
   Target: Open investment account within 30 days.

4. DUPLICATE YOUR RESULTS
   What works once can work again and again.
   Target: Scale winning strategies by 90 days 2.

════════════════════════════════════════════════════════════
YOUR NEXT STEPS (Do This Today)
════════════════════════════════════════════════════════════

1. Schedule a 30-minute strategy call with a Success Resources coach
   → Discuss your specific situation and refine this blueprint
   → Get accountability partner assignment
   → Access exclusive resources and tools

2. Join our free community group
   → Connect with others on similar financial journeys
   → Share wins and challenges
   → Get expert guidance weekly

3. Download supplementary guides
   → Income Multiplication Strategies
   → Smart Expense Reduction Framework
   → ${debtStatus === 'High Debt' ? 'Debt Elimination Roadmap' : 'Investment Getting Started Guide'}

════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleDateString()}
90-Day Blueprint for Financial Freedom
Powered by Success Resources | Master Your Mindset. Scale Your Success.

════════════════════════════════════════════════════════════`;

  return blueprint;
}

/**
 * Helper function: Get currency symbol
 */
function getCurrencySymbol(currency) {
  const symbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CHF': 'CHF',
    'CAD': 'C$', 'AUD': 'A$', 'NZD': 'NZ$', 'INR': '₹', 'SGD': 'SGD$',
    'HKD': 'HK$', 'CNY': '¥', 'MYR': 'RM', 'THB': '฿', 'IDR': 'Rp',
    'PHP': '₱', 'KRW': '₩', 'ZAR': 'R', 'BRL': 'R$', 'MXN': '$'
  };
  return symbols[currency] || currency;
}

/**
 * Helper function: Get surplus thresholds by currency
 */
function getSurplusThresholds(currency) {
  const thresholds = {
    'USD': { tight: 500, strong: 2000 },
    'EUR': { tight: 450, strong: 1800 },
    'GBP': { tight: 400, strong: 1600 },
    'INR': { tight: 40000, strong: 160000 },
    'SGD': { tight: 700, strong: 2800 },
    'AUD': { tight: 650, strong: 2600 },
    'CAD': { tight: 600, strong: 2400 },
  };
  return thresholds[currency] || { tight: 500, strong: 2000 };
}

/**
 * Helper function: Get savings thresholds by currency
 */
function getSavingsThresholds(currency) {
  const thresholds = {
    'USD': { building: 5000, solid: 30000 },
    'EUR': { building: 4500, solid: 27000 },
    'GBP': { building: 4000, solid: 24000 },
    'INR': { building: 400000, solid: 2400000 },
    'SGD': { building: 7000, solid: 42000 },
    'AUD': { building: 7500, solid: 45000 },
    'CAD': { building: 6500, solid: 39000 },
  };
  return thresholds[currency] || { building: 5000, solid: 30000 };
}

/**
 * Helper function: Format numbers with commas
 */
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Generate Phase 1 content based on profile
 */
function generatePhase1Content(profileType, debtStatus, surplus, debt, symbol) {
  let content = '';
  
  if (profileType === 'Tight Budget') {
    content = `
Your surplus is limited (${symbol}${formatNumber(surplus)}/month).
Focus: Expense optimization and income increase.
Priority: Find ways to reduce expenses without reducing quality of life.`;
  } else if (profileType === 'Strong Income') {
    content = `
Your surplus is strong (${symbol}${formatNumber(surplus)}/month).
Focus: Strategic wealth building and diversification.
Priority: Allocate surplus across savings, debt payoff, and investments.`;
  } else {
    content = `
Your surplus is moderate (${symbol}${formatNumber(surplus)}/month).
Focus: Balanced growth strategy.
Priority: Build savings while managing existing debt.`;
  }

  if (debtStatus === 'High Debt') {
    content += `\n\nDebt Alert: Your debt-to-income ratio is high.
Recommendation: 40% surplus to debt payoff, 60% to other goals.`;
  }

  return content;
}

/**
 * Generate Phase 2 content based on goal
 */
function generatePhase2Content(goal, surplus, savings, timeframe, symbol) {
  const goalStrategies = {
    'Build emergency fund': `
Target: 3-6 months of expenses in accessible savings
Current Progress: ${symbol}${formatNumber(savings)}
Monthly Target: ${symbol}${formatNumber(surplus * 0.6)}
Estimated Achievement: ${timeframe}`,
    'Generate passive income': `
Target: ${symbol}${formatNumber(surplus * 12)} in annual passive income
Current Status: Assess current passive income sources
Strategy: Open investment account and start consistent investing
Timeline: ${timeframe}`,
    'Pay off debt': `
Target: Reduce debt by ${symbol}${formatNumber(surplus * 30)}
Current Debt: ${symbol}${formatNumber(surplus * 100)}
Strategy: Prioritize high-interest debt first
Timeline: ${timeframe}`,
    'Save for major purchase': `
Target: Accumulate funds for major purchase
Current Savings: ${symbol}${formatNumber(savings)}
Monthly Allocation: ${symbol}${formatNumber(surplus * 0.7)}
Timeline: ${timeframe}`
  };

  return goalStrategies[goal] || `
Target Goal: ${goal}
Current Resources: ${symbol}${formatNumber(savings)} in savings
Monthly Allocation: ${symbol}${formatNumber(surplus)}
Timeline: ${timeframe}`;
}

/**
 * Generate implementation steps based on profile and goal
 */
function generateImplementationSteps(profileType, goal, riskTolerance) {
  let steps = '';
  
  if (profileType === 'Tight Budget') {
    steps += '1. Audit all subscriptions and recurring expenses\n';
    steps += '2. Implement "no-spend" challenges to find savings\n';
    steps += '3. Explore side income opportunities (2-5 hours/week)\n';
  } else if (profileType === 'Strong Income') {
    steps += '1. Set up automatic monthly investments\n';
    steps += '2. Diversify across multiple investment types\n';
    steps += '3. Explore business or investment opportunities\n';
  } else {
    steps += '1. Create detailed expense tracking system\n';
    steps += '2. Identify top 3 expense reduction opportunities\n';
    steps += '3. Plan systematic investment approach\n';
  }

  if (riskTolerance === 'Low') {
    steps += '4. Focus on stable, low-volatility investments\n';
    steps += '5. Build bond/fixed income portfolio\n';
  } else if (riskTolerance === 'High') {
    steps += '4. Explore growth stocks and emerging opportunities\n';
    steps += '5. Consider venture capital or startup investments\n';
  } else {
    steps += '4. Create balanced portfolio (stocks/bonds/cash)\n';
    steps += '5. Rebalance quarterly based on performance\n';
  }

  return steps;
}

/**
 * POST /api/submit-form
 * Receives form data, generates blueprint, and forwards to Zapier webhook
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

    // Generate unique blueprint
    console.log('🔧 Generating personalized blueprint...');
    const blueprintContent = generatePersonalizedPlan(formData);
    console.log('✅ Blueprint generated successfully');

    // Forward to Zapier webhook
    const zapierUrl = 'https://hooks.zapier.com/hooks/catch/3435365/u7o9p8p/';
    console.log('📡 Sending to Zapier:', zapierUrl);

    const zapierPayload = {
      email: formData.email || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      country: formData.country || '',
      currency: formData.currency || '',
      monthlyIncome: formData.monthlyIncome || 0,
      monthlyExpenses: formData.monthlyExpenses || 0,
      monthlySurplus: (formData.monthlyIncome || 0) - (formData.monthlyExpenses || 0),
      currentSavings: formData.currentSavings || 0,
      totalDebt: formData.totalDebt || 0,
      financialGoal: formData.financialGoal || '',
      timeframe: formData.timeframe || '',
      incomeStreams: formData.incomeStreams || '',
      incomeInterest: formData.incomeInterest || '',
      investmentExperience: formData.investmentExperience || '',
      riskTolerance: formData.riskTolerance || '',
      blueprintContent: blueprintContent,
      submittedAt: new Date().toISOString()
    };

    console.log('📦 Payload ready with blueprint (', blueprintContent.length, 'characters)');

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
    message: 'Financial Freedom Analyzer API with Blueprint Generation',
    features: [
      'Form submission and validation',
      'Personalized 90-day blueprint generation',
      'Zapier webhook integration',
      'Active Campaign contact creation',
      'Multi-currency and multi-country support'
    ]
  });
});

/**
 * Default export for Vercel
 */
module.exports = app;
