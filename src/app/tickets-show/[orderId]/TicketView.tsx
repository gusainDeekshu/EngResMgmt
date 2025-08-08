// src/app/tickets-show/[orderId]/TicketView.tsx

"use client"; // This directive is essential!

import Image from 'next/image';
// --- FIX 1: Change the import to a named import ---
import { QRCodeSVG } from 'qrcode.react'; 

// --- DATA SHAPES (Can be imported from another file) ---
interface VenueDetails {
  name: string;
  address: string;
}

interface TicketDetails {
  eventName: string;
  attendeeName: string;
  eventDate: string;
  eventTime: string;
  location: VenueDetails | null;
  ticketNumber: string;
  qrCodeData: string;
  readableCode: string;
}

interface PageProps {
  ticket: TicketDetails;
}

// --- THE CLIENT COMPONENT FOR DISPLAY ---
export default function TicketView({ ticket }: PageProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* App Download Banners Section */}
        <div className={styles.appBanner}>
          <h2 className={styles.bannerTitle}>Get the Full Experience</h2>
          <p className={styles.bannerSubtitle}>Open this ticket in the app for easy check-in and event updates.</p>
          <div className={styles.storeButtons}>
            <a href="YOUR_APP_STORE_URL" target="_blank" rel="noopener noreferrer">
              <Image src="/app-store-badge.svg" alt="Download on the App Store" width={150} height={50} priority />
            </a>
            <a href="YOUR_GOOGLE_PLAY_URL" target="_blank" rel="noopener noreferrer">
              <Image src="/google-play-badge.png" alt="Get it on Google Play" width={168} height={50} priority />
            </a>
          </div>
        </div>

        {/* Ticket Visual Section */}
        <div className={styles.ticketCard}>
          <div className={styles.header}>
            <h1>{ticket.eventName}</h1>
            <span>{ticket.attendeeName}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <strong>Date:</strong> {ticket.eventDate}
            </div>
            <div className={styles.detailItem}>
              <strong>Time:</strong> {ticket.eventTime}
            </div>
            <div className={styles.detailItem}>
              <strong>Location:</strong> {ticket.location?.name ?? 'Venue TBD'}
            </div>
            <div className={styles.detailItem}>
              <strong>Address:</strong> {ticket.location?.address ?? 'Address not available'}
            </div>
          </div>

          <div className={styles.qrSection}>
            <div className={styles.qrCodeWrapper}>
              {/* --- FIX 2: Update the component name to match the import --- */}
              <QRCodeSVG
                value={ticket.qrCodeData}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className={styles.readableCode}>{ticket.readableCode}</p>
          </div>

          <div className={styles.footer}>
            <p>Ticket #{ticket.ticketNumber}</p>
          </div>
        </div>
      </main>
    </div>
  );
}