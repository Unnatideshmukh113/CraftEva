package com.crafteva.services;

import com.crafteva.entity.Order;
import java.io.ByteArrayOutputStream;

public interface InvoiceService {
    ByteArrayOutputStream generateInvoice(Order order);
}
