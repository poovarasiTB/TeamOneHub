import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TicketList } from './tickets/TicketList';
import { TicketDetail } from './tickets/TicketDetail';
import { CreateTicket } from './tickets/CreateTicket';
import { KnowledgeBase } from './knowledge/KnowledgeBase';

export function SupportHub() {
  return (
    <div className="support-hub">
      <Routes>
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
      </Routes>
    </div>
  );
}
