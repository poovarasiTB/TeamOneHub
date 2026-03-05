import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { InvoiceList } from './invoices/InvoiceList';
import { InvoiceDetail } from './invoices/InvoiceDetail';
import { CreateInvoice } from './invoices/CreateInvoice';
import { CustomerList } from './customers/CustomerList';
import { ExpenseTracker } from './expenses/ExpenseTracker';
import { FinancialReports } from './reports/FinancialReports';

export function MoneyHub() {
  return (
    <div className="money-hub">
      <Routes>
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/expenses" element={<ExpenseTracker />} />
        <Route path="/reports" element={<FinancialReports />} />
      </Routes>
    </div>
  );
}
