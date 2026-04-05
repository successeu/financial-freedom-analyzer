const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { put } = require('@vercel/blob');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

/**
 * Generate Blueprint PDF and upload to Vercel Blob
 * Returns downloadable URL
 */
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const {
            firstName, lastName, email, currencyCode,
            income, expenses, savings, debt, surplus,
            incomeSources, goals, countryName, timeline, riskTolerance
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate HTML blueprint content
        const blueprintHTML = generateBlueprintHTML({
            firstName, lastName, email, currencyCode,
            income, expenses, savings, debt, surplus,
            incomeSources, goals, countryName, timeline, riskTolerance
        });

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.createPage();
        await page.setContent(blueprintHTML, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();

        // Upload PDF to Vercel Blob
        const fileName = `blueprint_${firstName}_${lastName}_${Date.now()}.pdf`;
        const blob = await put(fileName, pdfBuffer, {
            access: 'public',
            contentType: 'application/pdf'
        });

        // Return download URL
        res.json({ pdfUrl: blob.url });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
    }
});

/**
 * Generate beautiful, professional blueprint HTML
 */
function generateBlueprintHTML(data) {
    const {
        firstName, lastName, email, currencyCode,
        income, expenses, savings, debt, surplus,
        incomeSources, goals, countryName, timeline, riskTolerance
    } = data;

    const formatCurrency = (value) => {
        return `${currencyCode} ${Math.round(value).toLocaleString()}`;
    };

    const surplus90 = surplus * 3;
    const surplusYear = surplus * 12;
    const surplus5Year = surplus * 12 * 5 * 1.05;

    let insightBox = '';
    if (surplus > 0) {
        insightBox = `
            <div style="background: #f0f9ff; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #22c55e; margin: 0 0 12px 0;">✨ WEALTH-BUILDING OPPORTUNITY DETECTED</h3>
                <p style="color: #333; line-height: 1.6;">Your <strong>${formatCurrency(surplus)} monthly surplus</strong> is your wealth accelerator. This is real, achievable, and within reach RIGHT NOW.</p>
                <div style="background: #fff; padding: 15px; border-radius: 6px; margin: 12px 0;">
                    <p><strong>90-Day Projection:</strong> ${formatCurrency(surplus90)}</p>
                    <p><strong>1-Year Projection:</strong> ${formatCurrency(surplusYear)}</p>
                    <p><strong>5-Year Projection (5% growth):</strong> ${formatCurrency(surplus5Year)}</p>
                </div>
                <p style="color: #22c55e; font-weight: bold;">Status: 🟢 READY TO ACCELERATE</p>
            </div>
        `;
    } else if (surplus === 0) {
        insightBox = `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #f59e0b; margin: 0 0 12px 0;">⚠️ CRITICAL ADJUSTMENT NEEDED</h3>
                <p style="color: #333; line-height: 1.6;">You're at break-even. To build wealth, reduce expenses by 10-15% = ${formatCurrency(expenses * 0.125)}/month available for growth.</p>
            </div>
        `;
    } else {
        const deficit = Math.abs(surplus);
        insightBox = `
            <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ef4444; margin: 0 0 12px 0;">🚨 FINANCIAL ALERT</h3>
                <p style="color: #333; line-height: 1.6;">Deficit spending: ${formatCurrency(deficit)}/month. Annual drain: ${formatCurrency(deficit * 12)}. Close this gap within 30 days.</p>
            </div>
        `;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: #1f2937;
                    line-height: 1.6;
                    background: #ffffff;
                }
                .container { max-width: 800px; margin: 0 auto; padding: 40px; }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #ff8120;
                    padding-bottom: 30px;
                    margin-bottom: 40px;
                }
                .header h1 {
                    font-size: 32px;
                    color: #ff8120;
                    margin: 0 0 10px 0;
                }
                .header p { color: #666; font-size: 14px; }
                .section { margin: 30px 0; page-break-inside: avoid; }
                .section h2 {
                    font-size: 20px;
                    color: #000;
                    margin: 20px 0 15px 0;
                    border-left: 4px solid #ff8120;
                    padding-left: 15px;
                }
                .metric {
                    display: inline-block;
                    background: #f3f4f6;
                    padding: 15px 20px;
                    margin: 10px 10px 10px 0;
                    border-radius: 6px;
                    border-left: 3px solid #ff8120;
                }
                .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
                .metric-value { font-size: 18px; font-weight: bold; color: #ff8120; margin-top: 5px; }
                .action-plan { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 3px solid #ff8120; }
                .action-plan p { margin: 8px 0; font-size: 14px; }
                .action-plan strong { color: #ff8120; }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 2px solid #e5e7eb;
                    color: #666;
                    font-size: 12px;
                }
                .success { color: #22c55e; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💰 Your 90-Day Wealth Blueprint</h1>
                    <p>Personalized Strategic Wealth Creation Plan</p>
                </div>

                <div class="section">
                    <h2>📋 Your Profile</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Location:</strong> ${countryName}</p>
                    <p><strong>Currency:</strong> ${currencyCode}</p>
                </div>

                <div class="section">
                    <h2>💰 Financial Snapshot</h2>
                    <div class="metric">
                        <div class="metric-label">Monthly Income</div>
                        <div class="metric-value">${formatCurrency(income)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Monthly Expenses</div>
                        <div class="metric-value">${formatCurrency(expenses)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Monthly Surplus</div>
                        <div class="metric-value" style="color: #22c55e;">${formatCurrency(surplus)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Current Savings</div>
                        <div class="metric-value">${formatCurrency(savings)}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Total Debt</div>
                        <div class="metric-value" style="color: #ef4444;">${formatCurrency(debt)}</div>
                    </div>
                </div>

                <div class="section">
                    ${insightBox}
                </div>

                <div class="section">
                    <h2>🎯 Your Goals & Strategy</h2>
                    <p><strong>Primary Goals:</strong> ${goals || 'Financial Growth'}</p>
                    <p><strong>Timeline:</strong> ${timeline}</p>
                    <p><strong>Risk Tolerance:</strong> ${riskTolerance}</p>
                    <p><strong>Income Sources:</strong> ${incomeSources}</p>
                </div>

                <div class="section">
                    <h2>📊 90-Day Action Plan</h2>
                    <div class="action-plan">
                        <strong>Week 1-2: Foundation Building</strong>
                        <p>✓ Set up automated savings transfer (${formatCurrency(surplus * 0.5)}/month minimum)</p>
                        <p>✓ Review and optimize expenses</p>
                        <p>✓ Create emergency fund target</p>
                    </div>
                    <div class="action-plan">
                        <strong>Week 3-4: Strategic Growth</strong>
                        <p>✓ Deploy first investment: ${formatCurrency(surplus * 0.7)}</p>
                        <p>✓ Set up tracking system</p>
                        <p>✓ Review portfolio allocation</p>
                    </div>
                    <div class="action-plan">
                        <strong>Week 5-8: Momentum & Scaling</strong>
                        <p>✓ Increase savings to ${formatCurrency(surplus)} (100% capacity)</p>
                        <p>✓ Explore additional income streams</p>
                        <p>✓ Analyze progress against targets</p>
                    </div>
                    <div class="action-plan">
                        <strong>Week 9-12: Optimization & Momentum</strong>
                        <p>✓ 90-day projection review: ${formatCurrency(surplus90)}</p>
                        <p>✓ Plan next phase strategies</p>
                        <p>✓ Celebrate wins & recommit</p>
                    </div>
                </div>

                <div class="section">
                    <h2>🚀 5-Year Vision</h2>
                    <p>With consistent discipline and strategic action, your projected wealth position in 5 years:</p>
                    <div class="metric" style="display: block;">
                        <div class="metric-label">5-Year Wealth Projection</div>
                        <div class="metric-value" style="font-size: 24px;">${formatCurrency(surplus5Year)}</div>
                    </div>
                    <p style="margin-top: 15px; color: #22c55e; font-weight: bold;">This assumes consistent ${formatCurrency(surplus)}/month deployment with 5% annual growth.</p>
                </div>

                <div class="section">
                    <h2>💡 Key Principles for Success</h2>
                    <p>✓ <strong>Consistency Over Perfection:</strong> Small, consistent actions compound dramatically</p>
                    <p>✓ <strong>System-Based Thinking:</strong> Automate savings/investments, remove decision fatigue</p>
                    <p>✓ <strong>Continuous Learning:</strong> Invest in financial education alongside capital</p>
                    <p>✓ <strong>Resilience:</strong> Market fluctuations are normal; stay committed to your plan</p>
                    <p>✓ <strong>Income Focus:</strong> Growing income faster than expenses accelerates wealth exponentially</p>
                </div>

                <div class="footer">
                    <p>Generated: ${new Date().toLocaleDateString()} | Financial Freedom Analyzer</p>
                    <p>This blueprint is personalized to your situation. Review quarterly and adjust as your life evolves.</p>
                    <p style="margin-top: 15px;">Ready to accelerate? Book your 90-Day Strategy Session: <strong>calendly.com/june-yoon/your-90-day-wealth-blueprint</strong></p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Blueprint PDF API running on port ${PORT}`);
});

module.exports = app;
