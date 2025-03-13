import Image from "next/image";
import Link from "next/link";
import { Deal } from "@prisma/client";

export default async function Home() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/deals`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const deals = await response.json() as Deal[];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Latest Tech Deals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal: Deal) => (
          <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={deal.imageUrl}
                alt={deal.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
              <p className="text-gray-600 mb-4">{deal.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-green-600">${deal.price}</span>
                  {deal.oldPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${deal.oldPrice}
                    </span>
                  )}
                </div>
                
                {deal.couponCode && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {deal.couponCode}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href={deal.productUrl}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Deal
                </Link>
                
                <div className="text-sm text-gray-500">
                  via {deal.source}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
  } catch (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading deals</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
