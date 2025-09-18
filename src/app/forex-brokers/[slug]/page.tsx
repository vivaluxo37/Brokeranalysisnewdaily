import { redirect } from 'next/navigation';

/**
 * Forex Brokers Route Handler
 * 
 * This component handles the /forex-brokers/[slug] route by redirecting
 * to the main /brokers/[slug] route to maintain URL consistency
 * while supporting the expected /forex-brokers/ URL structure.
 */
export default async function ForexBrokerPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params before accessing properties
  const { slug } = await params;
  
  // Server-side redirect to the main brokers route
  redirect(`/brokers/${slug}`);
}