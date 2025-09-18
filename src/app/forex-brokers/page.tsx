import { redirect } from 'next/navigation';

/**
 * Forex Brokers Directory Page
 * 
 * This component handles the /forex-brokers route by redirecting
 * to the main /brokers route to maintain consistency while
 * supporting the expected /forex-brokers/ URL structure.
 */
export default function ForexBrokersPage() {
  // Server-side redirect to the main brokers directory
  redirect('/brokers');
}