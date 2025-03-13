/** @typedef {import('@prisma/client').Deal} Deal */
/** @typedef {import('@prisma/client').PrismaClient} PrismaClient */

import { PrismaClient } from '@prisma/client';
import { scrapeAmazonDeals } from '../scrapers/amazon.js';
import { scrapeKouponDeals } from '../scrapers/koupon.js';
import { searchAmazonProducts } from './amazonApiService.js';

const prisma = new PrismaClient();

/** @returns {Promise<Deal[]>} */
export async function getAllDeals() {
  return prisma.deal.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/** @returns {Promise<void>} */
export async function syncDeals() {
  try {
    // Fetch deals from multiple sources with error handling
    const results = await Promise.allSettled([
      scrapeAmazonDeals(),
      scrapeKouponDeals()
    ]);

    const allDeals = results.reduce((deals, result) => {
      if (result.status === 'fulfilled') {
        return [...deals, ...result.value];
      }
      console.error('Error fetching deals:', result.reason);
      return deals;
    }, /** @type {Deal[]} */ ([]));

    if (allDeals.length === 0) {
      throw new Error('No deals could be fetched from any source');
    }

    // Upsert deals into database
    for (const deal of allDeals) {
      await prisma.deal.upsert({
        where: { id: deal.id },
        update: {
          title: deal.title,
          description: deal.description,
          price: deal.price,
          oldPrice: deal.oldPrice,
          imageUrl: deal.imageUrl,
          productUrl: deal.productUrl,
          couponCode: deal.couponCode,
          expiresAt: deal.expiresAt,
          source: deal.source,
          updatedAt: new Date()
        },
        create: deal
      });
    }

    // Clean up expired deals
    await prisma.deal.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error syncing deals:', error);
    throw error;
  }
}

/**
 * @param {string} id
 * @returns {Promise<Deal | null>}
 */
export async function getDealById(id) {
  return prisma.deal.findUnique({
    where: { id }
  });
}

/**
 * @param {string} query
 * @returns {Promise<Deal[]>}
 */
export async function searchDeals(query) {
  const [dbDeals, amazonProducts] = await Promise.all([
    prisma.deal.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    searchAmazonProducts(query)
  ]);

  return [...dbDeals, ...amazonProducts];
}