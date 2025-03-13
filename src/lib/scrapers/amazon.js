/** @typedef {import('@prisma/client').Deal} Deal */

import puppeteer from 'puppeteer';

/**
 * @typedef {Object} AmazonDeal
 * @property {string} asin
 * @property {string} title
 * @property {string} description
 * @property {number} currentPrice
 * @property {number} originalPrice
 * @property {string} imageUrl
 * @property {number} discountPercentage
 */

const AMAZON_STORE_ID = process.env.AMAZON_STORE_ID || '';

/**
 * @param {string} asin
 * @returns {string}
 */
function getAffiliateUrl(asin) {
  return `https://amazon.com/dp/${asin}?tag=${AMAZON_STORE_ID}`;
}

/** @returns {Promise<Deal[]>} */
export async function scrapeAmazonDeals() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navigate to Amazon Deals page
    await page.goto('https://www.amazon.com/deals', {
      waitUntil: 'networkidle0',
    });

    // Wait for deals to load
    await page.waitForSelector('[data-testid="deal-card"]');

    // Extract deals information
    const deals = await page.evaluate(() => {
      const dealCards = document.querySelectorAll('[data-testid="deal-card"]');
      return Array.from(dealCards, card => {
        const asin = card.getAttribute('data-asin') || '';
        const title = card.querySelector('.deal-title')?.textContent?.trim() || '';
        const description = card.querySelector('.deal-description')?.textContent?.trim() || '';
        const currentPrice = parseFloat(card.querySelector('.deal-price')?.textContent?.replace(/[^0-9.]/g, '') || '0');
        const originalPrice = parseFloat(card.querySelector('.list-price')?.textContent?.replace(/[^0-9.]/g, '') || '0');
        const imageUrl = card.querySelector('img')?.getAttribute('src') || '';
        
        // Calculate discount percentage
        const discountPercentage = originalPrice > 0 ? ((originalPrice - currentPrice) / originalPrice) * 100 : 0;

        // Only return deals with more than 50% off
        if (discountPercentage >= 50) {
          return {
            asin,
            title,
            description,
            currentPrice,
            originalPrice,
            imageUrl,
            discountPercentage
          };
        }
        return null;
      }).filter(deal => deal !== null);
    });

    // Transform AmazonDeal[] to Deal[]
    return deals.map(deal => ({
      id: `amazon-${deal.asin}`,
      title: deal.title,
      description: deal.description,
      price: deal.currentPrice,
      oldPrice: deal.originalPrice,
      imageUrl: deal.imageUrl,
      productUrl: getAffiliateUrl(deal.asin),
      source: 'Amazon',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Deals typically expire in 24 hours
      createdAt: new Date(),
      updatedAt: new Date(),
      couponCode: null
    }));

  } catch (error) {
    console.error('Error scraping Amazon deals:', error);
    throw new Error(`Failed to scrape Amazon deals: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}