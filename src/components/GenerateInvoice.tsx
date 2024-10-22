import { toMoney } from "@/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import moment from "moment";

const generateInvoice = (invoiceData: any) => {
  const doc = new jsPDF();

  // Invoice Title
  doc.setFontSize(18);
  doc.text("Invoice", 14, 22);
  doc.text(invoiceData.clientName?.toUpperCase(), 150, 22);

  // Invoice details
  doc.setFontSize(12);
  doc.text(`No Invoice: ${invoiceData.invoiceNo}`, 14, 30);
  doc.text(`Tanggal: ${moment(invoiceData.date).format("DD-MM-YYYY")}`, 14, 36);
  doc.text(`Toko Tujuan: ${invoiceData.clientAddress}`, 14, 42);

  // Invoice Table
  const tableColumn = ["Item", "Qty", "Harga", "Total Harga"];
  const tableRows: any[] = [];

  invoiceData.items.forEach((item: any) => {
    const row = [
      item.name,
      item.qty,
      `Rp ${toMoney(item.price)}`,
      `Rp ${toMoney((item.qty * item.price))}`,
    ];
    tableRows.push(row);
  });

  // AutoTable to generate the table in the PDF
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 60,
  });

  // Total Amount
  const totalAmount = invoiceData.items.reduce(
    (acc: any, item: any) => acc + item.qty * item.price,
    0
  );

  doc.text(
    `Total: Rp ${toMoney(totalAmount)}`,
    14,
    (doc as any).lastAutoTable.finalY + 10
  );

  doc.text(`Diantar Oleh`, 150, (doc as any).lastAutoTable.finalY + 50);
  doc.text(`${invoiceData.courier_name}`, 150, (doc as any).lastAutoTable.finalY + 80);


  // Save the PDF
  doc.save(`invoice ${invoiceData?.clientAddress}.pdf`);
};

export default generateInvoice;
