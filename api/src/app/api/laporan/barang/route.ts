import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// buat variabel prisma (PrismaClient)
const prisma = new PrismaClient();

export const GET = async () => {
  // tampilkan data barang
  const barang = await prisma.tb_barang.findMany({
    orderBy: {
      kode: "asc",
    },
  });

  // buat tabel untuk ekspor laporan barang
  // buat row untuk isi laporan
  const rows = barang.map(
    (item, index) =>
      `<tr class="content-row">
            <td class="content-column" style="text-align: center">${
              index + 1
            }</td>
            <td class="content-column" style="text-align: center">${
              item.kode
            }</td>
            <td class="content-column" style="text-align: left">${
              item.nama
            }</td>
            <td class="content-column" style="text-align: right">${item.harga.toLocaleString(
              "id-ID"
            )}</td>
            <td class="content-column" style="text-align: center">${
              item.satuan
            }</td>
         </tr>`
  );

  // buat tampilan laporan
  const html = `<html>
  <head>
    <title>Laporan Data Barang</title>
    <style>
      .title-page {
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
      }      
      table {
        border-collapse: collapse;
        width: 100%;
        font-family: Arial, sans-serif;
      }
      tr {
        page-break-inside: avoid;
      }
      .title-row {
        background-color: #ccc;
        font-size: 14px;        
      }
      .title-column {
        padding: 10px;
        border: 1px solid #000;
      }
      .content-row {
        font-size: 12px;
      }
      .content-column {
        padding: 5px;
        border: 1px solid #000;
      }      
    </style>
  </head>
  <body>
    <div class="title-page">Laporan Data Barang</div>
    <table>
          <thead>
              <tr class="title-row">
                  <th class="title-column" style="width: 5mm">No</th>
                  <th class="title-column" style="width: 40mm">Kode</th>
                  <th class="title-column" style="width: 75mm">Nama</th>
                  <th class="title-column" style="width: 30mm">Harga (Rp)</th>
                  <th class="title-column" style="width: 30mm">Satuan</th>                  
              </tr>
          </thead>

          <tbody>
              ${rows.join("")}
          </tbody>
    </table>
   </body>
   </html>`;

  // setup puppeteer  
  const browser = await puppeteer.launch({
    headless: true,
  });

  // setup page pdf
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
    <div></div>`,
    footerTemplate: `
    <div style="
      width: 100%;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-style: italic;
      text-align: center;
      padding: 5mm;
    ">
      Hal. <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>
  `,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  const pdfBuffer = Buffer.from(pdf);

  return new NextResponse(pdfBuffer, {
    // "Content-Disposition": "inline (preview) / attachment (download)",
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=laporan-barang.pdf",
    },
  });
};
