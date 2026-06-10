"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, FileText, Download, Trash2, User, Building, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export default function InvoicePage() {
  const { settings } = useHisaabContext();
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text(settings.shopName || "Hisaab Invoice", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice Date: ${format(new Date(), "PPP")}`, 20, 28);
    doc.text(`Invoice No: INV-${Date.now().toString().slice(-6)}`, 20, 33);

    // Client Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Bill To:", 20, 50);
    doc.setFontSize(10);
    doc.text(clientName || "Cash Customer", 20, 57);
    if (clientAddress) doc.text(clientAddress, 20, 62);

    // Table
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Qty", "Price", "Total"]],
      body: items.map(item => [
        item.description,
        item.quantity,
        `${settings.currency} ${item.price}`,
        `${settings.currency} ${item.quantity * item.price}`
      ]),
      headStyles: { fillColor: [99, 102, 241] },
      foot: [["", "", "Grand Total", `${settings.currency} ${calculateTotal()}`]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, finalY);
    
    doc.save(`Invoice_${clientName || "Customer"}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Invoice Generator</h2>
          <p className="text-sm text-muted-foreground">Create professional bills instantly</p>
        </div>
        <Button onClick={generatePDF} className="rounded-2xl premium-gradient h-12 px-6 shadow-lg shadow-primary/20">
          <Download className="h-5 w-5 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card p-6 border-none">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Client Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input 
                  placeholder="Rahul Sharma" 
                  className="rounded-xl h-12 bg-secondary/50 border-none"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Address / Contact</Label>
                <Input 
                  placeholder="New Delhi, India" 
                  className="rounded-xl h-12 bg-secondary/50 border-none"
                  value={clientAddress}
                  onChange={e => setClientAddress(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Building className="h-4 w-4" />
                Line Items
              </h3>
              <Button variant="ghost" size="sm" onClick={addItem} className="text-primary font-bold">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-12 sm:col-span-6 space-y-2">
                    <Label className="text-[10px] uppercase">Description</Label>
                    <Input 
                      placeholder="Service or Product name" 
                      className="rounded-xl h-11 bg-secondary/30 border-none"
                      value={item.description}
                      onChange={e => updateItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-2">
                    <Label className="text-[10px] uppercase">Qty</Label>
                    <Input 
                      type="number"
                      className="rounded-xl h-11 bg-secondary/30 border-none text-center"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3 space-y-2">
                    <Label className="text-[10px] uppercase">Price</Label>
                    <Input 
                      type="number"
                      className="rounded-xl h-11 bg-secondary/30 border-none"
                      value={item.price}
                      onChange={e => updateItem(index, "price", Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex justify-center pb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(index)}
                      className="text-rose-500 hover:bg-rose-50"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card p-6 border-none sticky top-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">{settings.currency} {calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span className="font-bold">{settings.currency} 0</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-primary">{settings.currency} {calculateTotal()}</span>
              </div>
              <Button onClick={generatePDF} className="w-full h-12 rounded-2xl premium-gradient mt-4">
                Generate Invoice
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
