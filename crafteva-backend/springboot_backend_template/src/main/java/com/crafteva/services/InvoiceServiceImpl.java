package com.crafteva.services;

import com.crafteva.entity.Order;
import com.crafteva.entity.OrderItem;
import com.crafteva.repository.OrderItemRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final OrderItemRepository orderItemRepository;

    @Override
    public ByteArrayOutputStream generateInvoice(Order order) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            Paragraph header = new Paragraph("CRAFTEVA - INVOICE")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(header);

            // Invoice Details
            Paragraph invoiceInfo = new Paragraph()
                    .add("Invoice #: " + order.getOrderId() + "\n")
                    .add("Date: " + order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + "\n")
                    .add("Status: " + order.getStatus().name())
                    .setMarginBottom(20);
            document.add(invoiceInfo);

            // Customer Details
            Paragraph customerInfo = new Paragraph()
                    .add("Bill To:\n")
                    .add(order.getBuyer().getName() + "\n")
                    .add(order.getBuyer().getEmail() + "\n")
                    .add(order.getBuyer().getMobile() + "\n")
                    .add(order.getBuyer().getAddress())
                    .setMarginBottom(20);
            document.add(customerInfo);

            // Items Table
            Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2, 2}))
                    .useAllAvailableWidth()
                    .setMarginBottom(20);

            table.addHeaderCell(new Paragraph("Product").setBold());
            table.addHeaderCell(new Paragraph("Quantity").setBold());
            table.addHeaderCell(new Paragraph("Price").setBold());
            table.addHeaderCell(new Paragraph("Total").setBold());

            DecimalFormat df = new DecimalFormat("#.00");
            
            // Fetch order items
            List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());
            
            for (OrderItem item : orderItems) {
                table.addCell(item.getProduct().getProductName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell("₹" + df.format(item.getProduct().getPrice()));
                table.addCell("₹" + df.format(item.getPrice()));
            }

            document.add(table);

            // Total
            Paragraph total = new Paragraph()
                    .add("Total Amount: ₹" + df.format(order.getTotalAmount()))
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(20);
            document.add(total);

            // Footer
            Paragraph footer = new Paragraph()
                    .add("\n\nThank you for your purchase!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice: " + e.getMessage(), e);
        }

        return baos;
    }
}
