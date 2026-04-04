// api/server.js - Professional PDF Generation with Premium Design
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Generate personalized 90-day blueprint
 */
function generatePersonalizedPlan(formData) {
  const { firstName, country, currency, monthlyIncome, monthlyExpenses, currentSavings, totalDebt, financialGoal, timeframe, investmentExperience, riskTolerance } = formData;

  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const debtToIncomeRatio = totalDebt / (monthlyIncome || 1);
  const symbol = getCurrencySymbol(currency);

  let profileType = 'Balanced';
  const surplusThresholds = getSurplusThresholds(currency);
  
  if (monthlySurplus < surplusThresholds.tight) {
    profileType = 'Tight Budget';
  } else if (monthlySurplus > surplusThresholds.strong) {
    profileType = 'Strong Income';
  }

  let debtStatus = 'Manageable';
  if (debtToIncomeRatio > 3) {
    debtStatus = 'High Debt';
  } else if (totalDebt === 0) {
    debtStatus = 'Debt Free';
  }

  let savingsLevel = 'Starting';
  const savingsThresholds = getSavingsThresholds(currency);
  if (currentSavings >= savingsThresholds.solid) {
    savingsLevel = 'Solid';
  } else if (currentSavings >= savingsThresholds.building) {
    savingsLevel = 'Building';
  }

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
PHASE 1: ASSESS (Days 1-30)
════════════════════════════════════════════════════════════

Your Current Position:
${generatePhase1Content(profileType, debtStatus, monthlySurplus, totalDebt, symbol)}

Action Items:
□ Complete detailed expense audit
□ List all debt with interest rates
□ Calculate your actual monthly surplus
□ Document current savings accounts and balances
□ Review your investment experience level

════════════════════════════════════════════════════════════
PHASE 2: DESIGN (Days 31-60)
════════════════════════════════════════════════════════════

Strategy for Your Goal: "${financialGoal}"
Timeline: ${timeframe}

${generatePhase2Content(financialGoal, monthlySurplus, currentSavings, timeframe, symbol)}

Implementation Steps:
${generateImplementationSteps(profileType, financialGoal, riskTolerance)}

════════════════════════════════════════════════════════════
PHASE 3: EXECUTE (Days 61-90)
════════════════════════════════════════════════════════════

Weekly Milestones:
Week 1-2:   Set up automatic transfers and tracking systems
Week 3-4:   Launch first income stream or investment
Week 5-8:   Build momentum and adjust as needed
Week 9-12:  Review progress and plan next 90 days

Success Metrics:
✓ Savings increased: Target ${symbol}${formatNumber(monthlySurplus * 30)}
✓ Debt reduced: Target ${symbol}${formatNumber(totalDebt * 0.1)}
✓ New income stream: Started
✓ Investment account: Opened

════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleDateString()}
Powered by Success Resources | Master Your Mindset. Scale Your Success.

════════════════════════════════════════════════════════════`;

  return blueprint;
}

/**
 * Generate PROFESSIONAL HTML for PDF rendering
 * Premium design with visual hierarchy and modern styling
 */
function generateProfessionalBlueprintHTML(formData, blueprintContent) {
  const { firstName, lastName, country, currency, monthlyIncome, monthlyExpenses, currentSavings, totalDebt, financialGoal, timeframe, investmentExperience, riskTolerance } = formData;

  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const symbol = getCurrencySymbol(currency);
  const savingsRate = ((monthlySurplus / monthlyIncome) * 100).toFixed(0);
  const debtToIncomeRatio = (totalDebt / monthlyIncome).toFixed(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; color: #2c3e50; line-height: 1.6; background: white; }
    .container { max-width: 900px; margin: 0 auto; background: white; }
    
    .hero-header { background: linear-gradient(135deg, #ff8120 0%, #ff6b35 50%, #ff5c28 100%); color: white; padding: 50px 40px; text-align: center; position: relative; overflow: hidden; }
    .hero-header::before { content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; background: rgba(255,255,255,0.05); border-radius: 50%; }
    .hero-header h1 { font-size: 42px; font-weight: 800; margin-bottom: 10px; position: relative; z-index: 1; letter-spacing: -0.5px; }
    .hero-header .tagline { font-size: 16px; opacity: 0.95; margin-bottom: 5px; position: relative; z-index: 1; }
    .hero-header .user-name { font-size: 28px; font-weight: 700; margin-top: 15px; position: relative; z-index: 1; }
    
    .financial-snapshot { padding: 40px; background: #f8fafc; }
    .section-title { font-size: 18px; font-weight: 700; color: #2c3e50; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
    .section-title::before { content: ''; width: 4px; height: 24px; background: #ff8120; border-radius: 2px; }
    
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
    .metric-card { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e8eef5; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .metric-label { font-size: 11px; color: #7f8c9a; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px; }
    .metric-value { font-size: 24px; font-weight: 800; color: #ff8120; margin-bottom: 4px; }
    .metric-subtext { font-size: 11px; color: #95a3b3; }
    
    .progress-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }
    .progress-item { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e8eef5; }
    .progress-label { font-size: 12px; font-weight: 600; color: #2c3e50; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .progress-bar-bg { height: 8px; background: #ecf0f7; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #ff8120, #ff6b35); border-radius: 4px; }
    .progress-detail { font-size: 11px; color: #7f8c9a; display: flex; justify-content: space-between; }
    
    .phases-container { padding: 40px; }
    .phase-section { margin-bottom: 30px; }
    .phase-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
    .phase-number { width: 50px; height: 50px; background: linear-gradient(135deg, #ff8120, #ff6b35); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; }
    .phase-title h2 { font-size: 20px; font-weight: 700; color: #2c3e50; margin-bottom: 3px; }
    .phase-subtitle { font-size: 12px; color: #7f8c9a; font-weight: 500; }
    
    .phase-content { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #ff8120; margin-bottom: 15px; }
    .action-items { list-style: none; padding: 0; }
    .action-items li { padding: 10px 0; padding-left: 30px; position: relative; font-size: 13px; color: #2c3e50; border-bottom: 1px solid #ecf0f7; }
    .action-items li::before { content: '✓'; position: absolute; left: 0; color: #ff8120; font-weight: 700; }
    
    .key-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
    .metric-highlight { background: linear-gradient(135deg, #fff5f0, #ffe8e0); padding: 15px; border-radius: 8px; border: 1px solid #ffcbb8; text-align: center; }
    .metric-highlight .value { font-size: 20px; font-weight: 700; color: #ff8120; }
    .metric-highlight .label { font-size: 11px; color: #7f8c9a; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .cta-section { background: linear-gradient(135deg, #ff8120 0%, #ff6b35 100%); color: white; padding: 40px; border-radius: 12px; margin: 40px; text-align: center; }
    .cta-section h3 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
    .cta-section p { font-size: 14px; margin-bottom: 20px; opacity: 0.95; }
    .cta-details { background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 13px; line-height: 1.8; }
    
    .page-break { page-break-after: always; margin: 40px 0; }
    
    .footer { background: #2c3e50; color: white; padding: 40px; text-align: center; margin-top: 40px; }
    .footer-logo { font-size: 18px; font-weight: 800; margin-bottom: 10px; color: #ff8120; }
    .footer-tagline { font-size: 12px; opacity: 0.8; margin-bottom: 20px; }
    .footer-divider { height: 1px; background: rgba(255,255,255,0.2); margin: 20px 0; }
    .footer-text { font-size: 11px; opacity: 0.7; }
    
    @media print { body { background: white; } .container { max-width: 100%; } .phase-section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- HERO HEADER -->
    <div class="hero-header">
      <div class="tagline">Your Personal Wealth Blueprint</div>
      <h1>90-Day Action Plan</h1>
      <div class="user-name">${firstName} ${lastName}</div>
    </div>
    
    <!-- FINANCIAL SNAPSHOT -->
    <div class="financial-snapshot">
      <h2 class="section-title">Financial Snapshot</h2>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Monthly Income</div>
          <div class="metric-value">${symbol}${formatNumberForDisplay(monthlyIncome)}</div>
          <div class="metric-subtext">${country}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Monthly Expenses</div>
          <div class="metric-value">${symbol}${formatNumberForDisplay(monthlyExpenses)}</div>
          <div class="metric-subtext">Current spending</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Monthly Surplus</div>
          <div class="metric-value">${symbol}${formatNumberForDisplay(monthlySurplus)}</div>
          <div class="metric-subtext">${savingsRate}% rate</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Current Savings</div>
          <div class="metric-value">${symbol}${formatNumberForDisplay(currentSavings)}</div>
          <div class="metric-subtext">Saved to date</div>
        </div>
      </div>
      
      <!-- Progress Indicators -->
      <div class="progress-section">
        <div class="progress-item">
          <div class="progress-label">Savings Progress</div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${Math.min((currentSavings / (monthlyIncome * 3)) * 100, 100)}%"></div>
          </div>
          <div class="progress-detail">
            <span>${symbol}${formatNumberForDisplay(currentSavings)}</span>
            <span>Target: ${symbol}${formatNumberForDisplay(monthlyIncome * 3)}</span>
          </div>
        </div>
        <div class="progress-item">
          <div class="progress-label">Debt Status</div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${Math.min((totalDebt / (monthlyIncome * 12)) * 100, 100)}%"></div>
          </div>
          <div class="progress-detail">
            <span>Debt/Income: ${debtToIncomeRatio}x</span>
            <span>Goal: &lt;1.0x</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 90-DAY PHASES -->
    <div class="phases-container">
      <h2 class="section-title">Your 90-Day Action Plan</h2>
      
      <div class="phase-section">
        <div class="phase-header">
          <div class="phase-number">1</div>
          <div class="phase-title">
            <h2>Assess Your Foundation</h2>
            <div class="phase-subtitle">Days 1-30: Understanding Your Position</div>
          </div>
        </div>
        <div class="phase-content">
          <strong style="color: #ff8120;">Core Objective:</strong> Complete detailed financial analysis and establish baseline metrics.
        </div>
        <ul class="action-items">
          <li>Complete detailed expense audit across all categories</li>
          <li>List all debts with interest rates and minimums</li>
          <li>Calculate accurate monthly surplus (${symbol}${formatNumberForDisplay(monthlySurplus)})</li>
          <li>Document all savings and investment accounts</li>
          <li>Review investment experience (${investmentExperience})</li>
        </ul>
        <div class="key-metrics">
          <div class="metric-highlight">
            <div class="value">${savingsRate}%</div>
            <div class="label">Savings Rate</div>
          </div>
          <div class="metric-highlight">
            <div class="value">${debtToIncomeRatio}x</div>
            <div class="label">Debt Ratio</div>
          </div>
          <div class="metric-highlight">
            <div class="value">${timeframe}</div>
            <div class="label">Your Timeline</div>
          </div>
        </div>
      </div>
      
      <div class="phase-section">
        <div class="phase-header">
          <div class="phase-number">2</div>
          <div class="phase-title">
            <h2>Design Your Strategy</h2>
            <div class="phase-subtitle">Days 31-60: Building Your Roadmap</div>
          </div>
        </div>
        <div class="phase-content">
          <strong style="color: #ff8120;">Primary Goal:</strong> "${financialGoal}" in ${timeframe}
        </div>
        <ul class="action-items">
          <li>Set up automatic monthly transfers to savings</li>
          <li>Create tracking systems for income and expenses</li>
          <li>Open investment account (if applicable)</li>
          <li>Research 2-3 income increase opportunities</li>
          <li>Identify top 3 expense reductions worth ${symbol}${formatNumberForDisplay(monthlySurplus * 0.2)}/month</li>
        </ul>
      </div>
      
      <div class="phase-section">
        <div class="phase-header">
          <div class="phase-number">3</div>
          <div class="phase-title">
            <h2>Execute & Scale</h2>
            <div class="phase-subtitle">Days 61-90: Taking Action & Building Momentum</div>
          </div>
        </div>
        <div class="phase-content">
          <strong style="color: #ff8120;">Final Push:</strong> Launch income streams, implement expense reductions, and build sustainable systems.
        </div>
        <ul class="action-items">
          <li>Launch first income stream or investment</li>
          <li>Implement expense reduction saving ${symbol}${formatNumberForDisplay(monthlySurplus * 0.2)}/month</li>
          <li>Review and adjust based on 30-day progress</li>
          <li>Establish weekly check-in and tracking routine</li>
          <li>Plan milestone review and next 90-day goals</li>
        </ul>
      </div>
    </div>
    
    <!-- CTA SECTION -->
    <div class="cta-section">
      <h3>Ready to Transform Your Financial Life?</h3>
      <p>This blueprint is your starting point. The magic happens with support and accountability.</p>
      <div class="cta-details">
        <strong>Book a Free Strategy Call:</strong><br>
        Discuss your specific situation with a Success Resources coach<br>
        Refine this plan based on your unique circumstances<br>
        Get 90 days of accountability partner support
      </div>
      <p style="margin-top: 20px; font-size: 12px;">📅 calendly.com/june-yoon/30min</p>
    </div>
    
    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-logo">Success Resources</div>
      <div class="footer-tagline">Master Your Mindset. Scale Your Success.</div>
      <div class="footer-divider"></div>
      <div class="footer-text">
        <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>Powered by Financial Freedom Analyzer | © 2026 Success Resources</p>
        <p style="margin-top: 15px; opacity: 0.6;">Personalized blueprint using SpeedWealth principles</p>
      </div>
    </div>
    
  </div>
</body>
</html>
  `;
}

// Helper functions
function getCurrencySymbol(currency) {
  const symbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CHF': 'CHF', 'CAD': 'C$', 'AUD': 'A$', 'NZD': 'NZ$', 'INR': '₹', 'SGD': 'SGD$', 'HKD': 'HK$', 'CNY': '¥', 'MYR': 'RM', 'THB': '฿', 'IDR': 'Rp', 'PHP': '₱', 'KRW': '₩', 'ZAR': 'R', 'BRL': 'R$', 'MXN': '$' };
  return symbols[currency] || currency;
}

function getSurplusThresholds(currency) {
  const thresholds = { 'USD': { tight: 500, strong: 2000 }, 'EUR': { tight: 450, strong: 1800 }, 'GBP': { tight: 400, strong: 1600 }, 'INR': { tight: 40000, strong: 160000 }, 'SGD': { tight: 700, strong: 2800 }, 'AUD': { tight: 650, strong: 2600 }, 'CAD': { tight: 600, strong: 2400 }, };
  return thresholds[currency] || { tight: 500, strong: 2000 };
}

function getSavingsThresholds(currency) {
  const thresholds = { 'USD': { building: 5000, solid: 30000 }, 'EUR': { building: 4500, solid: 27000 }, 'GBP': { building: 4000, solid: 24000 }, 'INR': { building: 400000, solid: 2400000 }, 'SGD': { building: 7000, solid: 42000 }, 'AUD': { building: 7500, solid: 45000 }, 'CAD': { building: 6500, solid: 39000 }, };
  return thresholds[currency] || { building: 5000, solid: 30000 };
}

function formatNumber(num) {
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatNumberForDisplay(num) {
  return Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function generatePhase1Content(profileType, debtStatus, surplus, debt, symbol) {
  let content = '';
  if (profileType === 'Tight Budget') {
    content = `Your surplus is limited (${symbol}${formatNumber(surplus)}/month). Focus: Expense optimization and income increase.`;
  } else if (profileType === 'Strong Income') {
    content = `Your surplus is strong (${symbol}${formatNumber(surplus)}/month). Focus: Strategic wealth building and diversification.`;
  } else {
    content = `Your surplus is moderate (${symbol}${formatNumber(surplus)}/month). Focus: Balanced growth strategy.`;
  }
  if (debtStatus === 'High Debt') {
    content += `\n\nDebt Alert: Your debt-to-income ratio is high. Recommendation: 40% surplus to debt payoff, 60% to other goals.`;
  }
  return content;
}

function generatePhase2Content(goal, surplus, savings, timeframe, symbol) {
  const goalStrategies = {
    'Build emergency fund': `Target: 3-6 months of expenses\nCurrent: ${symbol}${formatNumber(savings)}\nMonthly Target: ${symbol}${formatNumber(surplus * 0.6)}`,
    'Generate passive income': `Target: ${symbol}${formatNumber(surplus * 12)}/year passive income\nStrategy: Open investment account\nTimeline: ${timeframe}`,
    'Pay off debt': `Target: Reduce debt by ${symbol}${formatNumber(surplus * 30)}\nStrategy: High-interest debt first\nTimeline: ${timeframe}`,
    'Save for major purchase': `Target: Accumulate funds\nCurrent: ${symbol}${formatNumber(savings)}\nAllocation: ${symbol}${formatNumber(surplus * 0.7)}/month`
  };
  return goalStrategies[goal] || `Goal: ${goal}\nResources: ${symbol}${formatNumber(savings)}\nMonthly: ${symbol}${formatNumber(surplus)}\nTimeline: ${timeframe}`;
}

function generateImplementationSteps(profileType, goal, riskTolerance) {
  let steps = '';
  if (profileType === 'Tight Budget') {
    steps += '1. Audit subscriptions and expenses\n2. Implement no-spend challenges\n3. Explore side income (2-5 hrs/week)\n';
  } else if (profileType === 'Strong Income') {
    steps += '1. Set up automatic investments\n2. Diversify investment types\n3. Explore business opportunities\n';
  } else {
    steps += '1. Create expense tracking\n2. Identify 3 reduction opportunities\n3. Plan investment approach\n';
  }
  if (riskTolerance === 'Low') {
    steps += '4. Focus on stable investments\n5. Build fixed income portfolio';
  } else if (riskTolerance === 'High') {
    steps += '4. Explore growth stocks\n5. Consider venture investments';
  } else {
    steps += '4. Create balanced portfolio\n5. Rebalance quarterly';
  }
  return steps;
}

/**
 * Generate PDF from HTML
 */
async function generatePDFFromHTML(htmlContent) {
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }, printBackground: true, preferCSSPageSize: true });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

/**
 * POST /api/submit-form
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('=== FORM SUBMISSION RECEIVED ===');
    const formData = req.body;

    if (!formData.email || !formData.monthlyIncome || !formData.monthlyExpenses || !formData.currentSavings) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    console.log('✅ Validation passed');
    console.log('🔧 Generating blueprint...');
    const blueprintContent = generatePersonalizedPlan(formData);
    console.log('✅ Blueprint generated');

    console.log('📄 Generating professional PDF...');
    const htmlContent = generateProfessionalBlueprintHTML(formData, blueprintContent);
    const pdfBuffer = await generatePDFFromHTML(htmlContent);
    console.log('✅ Professional PDF generated (', pdfBuffer.length, 'bytes)');

    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfFileName = `blueprint_${formData.firstName}_${formData.lastName}_${Date.now()}.pdf`;
    console.log('✅ PDF ready:', pdfFileName);

    const zapierUrl = 'https://hooks.zapier.com/hooks/catch/3435365/u7o9p8p/';
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
      blueprintPDFBase64: pdfBase64,
      blueprintPDFFileName: pdfFileName,
      submittedAt: new Date().toISOString()
    };

    try {
      const zapierResponse = await fetch(zapierUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(zapierPayload), timeout: 30000 });
      console.log('✅ Zapier response:', zapierResponse.status);
    } catch (zapierError) {
      console.error('⚠️ Zapier failed:', zapierError.message);
    }

    console.log('✅ Success!');
    return res.json({ success: true, message: 'Blueprint generated and sent!', email: formData.email, pdfGenerated: true });

  } catch (err) {
    console.error('❌ ERROR:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/status', (req, res) => {
  return res.json({ status: 'running', message: 'Financial Freedom Analyzer API with Professional PDFs', features: ['Professional PDF generation', 'Beautiful design', 'Personalized blueprints', 'Zapier integration'] });
});

module.exports = app;
