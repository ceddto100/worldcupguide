import PDFDocument from "pdfkit";
import type { Trip } from "./types";
import {
  accommodationLabel,
  categoryLabel,
  formatDateLabel,
  sortedEventsForDay,
  totalSpent,
  transportLabel,
  tripDays
} from "./utils";

const NAVY = "#0A0F1F";
const GOLD = "#F5C518";
const SOFT = "#6B7280";
const TEXT = "#111827";

export async function buildTripPdf(trip: Trip): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // pdfkit will look for built-in fonts; on serverless this can fail unless
      // we explicitly avoid font subsetting. Using a built-in PDF font (Helvetica)
      // sidesteps the AFM lookup that breaks Vercel deployments.
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 60, left: 60, right: 60, bottom: 60 },
        info: {
          Title: `${trip.destination} — Itinerary`,
          Author: "World Cup ATL Guide"
        }
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(c as Buffer));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // ----- Cover page -----
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
      doc.fillColor(GOLD).fontSize(12).font("Helvetica-Bold")
        .text("WORLD CUP ATL GUIDE", 60, 60, { characterSpacing: 2 });
      doc.fillColor("#ffffff").fontSize(10).font("Helvetica")
        .text("Trip Itinerary", { characterSpacing: 1 });

      doc.moveDown(8);
      doc.fillColor("#ffffff").fontSize(34).font("Helvetica-Bold")
        .text(trip.destination || "My Trip", { width: doc.page.width - 120 });

      doc.moveDown(0.6);
      const dates =
        trip.startDate && trip.endDate
          ? `${formatDateLabel(trip.startDate)}  →  ${formatDateLabel(trip.endDate)}`
          : "Dates TBD";
      doc.fontSize(13).font("Helvetica").fillColor("#cbd5e1").text(dates);

      if (trip.travelers.length > 0) {
        doc.moveDown(0.4);
        doc.fillColor("#94a3b8").fontSize(11)
          .text("Travelers: " + trip.travelers.join(", "));
      }

      // Cover footer
      doc.fillColor(GOLD).fontSize(9)
        .text("Independent local guide · worldcupatlguide.com", 60, doc.page.height - 80);

      doc.addPage();

      // ----- Helpers for content pages -----
      const sectionTitle = (s: string) => {
        doc.moveDown(0.6);
        doc.fillColor(TEXT).fontSize(16).font("Helvetica-Bold").text(s);
        doc.moveTo(60, doc.y + 2)
          .lineTo(doc.page.width - 60, doc.y + 2)
          .strokeColor(GOLD).lineWidth(1.5).stroke();
        doc.moveDown(0.4);
      };

      const para = (s: string, opts?: PDFKit.Mixins.TextOptions) => {
        doc.fillColor(TEXT).fontSize(10.5).font("Helvetica").text(s, opts);
      };
      const muted = (s: string) => {
        doc.fillColor(SOFT).fontSize(9.5).font("Helvetica").text(s);
      };

      // ----- Transportation -----
      sectionTitle("Transportation");
      if (trip.transport.length === 0) {
        muted("— no transportation legs —");
      } else {
        trip.transport.forEach((l, i) => {
          doc.fillColor(NAVY).fontSize(11).font("Helvetica-Bold")
            .text(`Leg ${i + 1}: ${transportLabel(l.mode)}`);
          const summary: string[] = [];
          if (l.airline || l.flightNumber)
            summary.push([l.airline, l.flightNumber].filter(Boolean).join(" "));
          if (l.terminal) summary.push(`Terminal ${l.terminal}`);
          if (l.rentalCompany) summary.push(l.rentalCompany);
          if (l.carClass) summary.push(l.carClass);
          if (l.pickupLocation) summary.push(`Pickup: ${l.pickupLocation}`);
          if (l.dropoffLocation) summary.push(`Dropoff: ${l.dropoffLocation}`);
          if (l.departureAddress) summary.push(`From ${l.departureAddress}`);
          if (l.estimatedDriveTime) summary.push(`~${l.estimatedDriveTime}`);
          if (l.carrier) summary.push(l.carrier);
          if (l.routeOrLine) summary.push(l.routeOrLine);
          if (l.rideshareService) summary.push(l.rideshareService);
          if (l.fromCity || l.toCity) summary.push(`${l.fromCity ?? "?"} → ${l.toCity ?? "?"}`);
          if (l.departDate) summary.push(`${l.departDate} ${l.departTime ?? ""}`.trim());
          if (l.confirmation) summary.push(`Conf #${l.confirmation}`);
          if (summary.length) muted(summary.join("  ·  "));
          if (l.notes) {
            doc.moveDown(0.1);
            muted(l.notes);
          }
          doc.moveDown(0.4);
        });
      }

      // ----- Accommodations -----
      sectionTitle("Accommodations");
      if (trip.stays.length === 0) {
        muted("— no stays —");
      } else {
        trip.stays.forEach((s) => {
          doc.fillColor(NAVY).fontSize(11).font("Helvetica-Bold")
            .text(`${s.name}  (${accommodationLabel(s.type)})`);
          const lines: string[] = [];
          if (s.address) lines.push(s.address);
          if (s.checkIn || s.checkOut)
            lines.push(
              `${s.checkIn ?? "?"}${s.checkInTime ? " " + s.checkInTime : ""} → ${s.checkOut ?? "?"}${s.checkOutTime ? " " + s.checkOutTime : ""}`
            );
          if (s.confirmation) lines.push(`Conf #${s.confirmation}`);
          if (s.amenities.length) lines.push("Amenities: " + s.amenities.join(", "));
          if (lines.length) muted(lines.join("  ·  "));
          doc.moveDown(0.3);
        });
      }

      // ----- Day-by-day timeline -----
      sectionTitle("Day-by-day timeline");
      const days = tripDays(trip);
      if (days.length === 0 || trip.events.length === 0) {
        muted("— no scheduled events —");
      } else {
        days.forEach((d) => {
          const events = sortedEventsForDay(trip, d);
          if (events.length === 0) return;
          doc.fillColor(NAVY).fontSize(12).font("Helvetica-Bold").text(formatDateLabel(d));
          events.forEach((e) => {
            const time = e.startTime
              ? `${e.startTime}${e.endTime ? "–" + e.endTime : ""}`
              : "—";
            doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(10).text(time, { continued: true });
            doc.fillColor(TEXT).font("Helvetica").fontSize(10.5)
              .text(`  ${e.title}  `, { continued: true });
            doc.fillColor(SOFT).font("Helvetica-Oblique").fontSize(9)
              .text(`[${categoryLabel(e.category)}]`);
            if (e.location) muted("📍 " + e.location);
            if (e.notes) muted(e.notes);
          });
          doc.moveDown(0.3);
        });
      }

      // ----- Budget -----
      sectionTitle("Budget summary");
      if (trip.budget.items.length === 0) {
        muted("— no budget items —");
      } else {
        const total = totalSpent(trip);
        para(
          `Total: ${trip.budget.currency} ${total.toFixed(2)}` +
            (trip.budget.cap > 0 ? `   /   Cap: ${trip.budget.currency} ${trip.budget.cap.toFixed(2)}` : "")
        );
        doc.moveDown(0.3);
        trip.budget.items.forEach((b) => {
          doc.fillColor(TEXT).font("Helvetica").fontSize(10)
            .text(`• [${b.category}] ${b.label}`, { continued: true });
          doc.fillColor(NAVY).font("Helvetica-Bold")
            .text(`   ${trip.budget.currency} ${b.amount.toFixed(2)}`);
        });
      }

      // ----- Packing -----
      if (trip.packing.length > 0) {
        sectionTitle("Packing list");
        const groups = ["clothing", "toiletries", "documents", "gear"] as const;
        groups.forEach((g) => {
          const items = trip.packing.filter((p) => p.category === g);
          if (items.length === 0) return;
          doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(11)
            .text(g.charAt(0).toUpperCase() + g.slice(1));
          items.forEach((p) => {
            doc.fillColor(TEXT).font("Helvetica").fontSize(10)
              .text(`${p.checked ? "☑" : "☐"}  ${p.label}`);
          });
          doc.moveDown(0.2);
        });
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
