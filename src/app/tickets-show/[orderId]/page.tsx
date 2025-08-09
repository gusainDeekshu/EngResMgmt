// src/app/tickets-show/[orderId]/page.tsx

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TicketView from './TicketView';

// --- DEFINE THE SHAPE OF YOUR TICKET DATA (Same as before) ---
interface VenueDetails {
  name: string;
  address: string;
}

interface TicketDetails {
  eventName:string;
  attendeeName: string;
  eventDate: string;
  eventTime: string;
  location: VenueDetails | null;
  ticketNumber: string;
  qrCodeData: string;
  readableCode: string;
}

interface PageParams {
  params: Promise<{
    orderId: string;
  }>;
}

// --- ASYNCHRONOUS DATA FETCHING FUNCTION ---
async function getTicketDetails(orderId: string): Promise<TicketDetails | null> {
  // THIS IS THE UPDATED LINE
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/public/${orderId}/details`;
  
  try {
    // Using { cache: 'no-store' } to ensure data is always fresh, similar to getServerSideProps
    const res = await fetch(apiUrl, { cache: 'no-store' });

    // If the ticket ID doesn't exist, the API should return an error status
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null; // Return null on network or other errors
  }
}

// --- DYNAMIC METADATA FUNCTION (Replaces <Head>) ---
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const ticket = await getTicketDetails((await params).orderId);

  if (!ticket) {
    return {
      title: 'Ticket Not Found',
    };
  }

  return {
    title: `Ticket for ${ticket.eventName}`,
    description: `Your web ticket for ${ticket.eventName} for attendee ${ticket.attendeeName}.`,
  };
}

// --- THE MAIN PAGE (A REACT SERVER COMPONENT) ---
export default async function TicketShowPage({ params }: PageParams) {
  const { orderId } =await params;
  const ticket = await getTicketDetails(orderId);

  // If no ticket is found, render the built-in 404 page
  if (!ticket) {
    notFound();
  }

  // Pass the fetched data to the Client Component for rendering
  return <TicketView ticket={ticket} />;
}