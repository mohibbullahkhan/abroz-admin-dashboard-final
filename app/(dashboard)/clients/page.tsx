'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { 
  Users,
  Plus,
  Upload,
  Download,
  Search,
  X,
  Trash2,
  CheckSquare,
  Square,
  Edit3,
  Package,
  FileSpreadsheet,
  FileText,
  UserPlus,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/lib/sweetalert';
import { 
  useGetCustomersQuery, 
  useCreateCustomerMutation, 
  useDeleteCustomerMutation,
  useUpdateCustomerMutation
} from '@/store/services/customersApi';

export default function ClientsPage() {
  const router = useRouter();
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [importTab, setImportTab] = useState<'upload' | 'paste' | 'manual'>('upload');
  const [manualRows, setManualRows] = useState([{ id: 1, name: '', phone: '' }, { id: 2, name: '', phone: '' }, { id: 3, name: '', phone: '' }]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [showEditContact, setShowEditContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editContactName, setEditContactName] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Import State
  const [pasteName, setPasteName] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [uploadData, setUploadData] = useState<{name: string, phone: string}[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomersQuery({
    page: currentPage,
    limit: 10,
    search: debouncedSearch || undefined,
  });
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers = customersData?.data || [];
  const meta = customersData?.meta;
  const totalPages = meta?.totalPages || 1;

  const contacts = customers.map(c => ({
    id: c._id,
    name: c.name,
    phone: c.mobileNumber,
    group: 'All', 
    dateAdded: new Date(c.createdAt).toLocaleDateString()
  }));

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      alerts.error("Missing Fields", "Please enter name and phone number.");
      return;
    }
    
    let cleanName = newContactName.replace(/["']/g, '').trim();
    let formattedPhone = newContactPhone.replace(/["'\s\-()+]/g, '');
    
    if (formattedPhone.startsWith('63')) {
      formattedPhone = '+' + formattedPhone;
    } else if (formattedPhone.startsWith('09')) {
      formattedPhone = '+63' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('9')) {
      formattedPhone = '+63' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      await createCustomer({ name: cleanName, mobileNumber: formattedPhone }).unwrap();
      alerts.toastSuccess("Client added successfully!");
      setShowAddContact(false);
      setNewContactName('');
      setNewContactPhone('');
    } catch (err: any) {
      alerts.error("Failed to add client", err?.data?.message || err?.message);
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    const confirmed = await alerts.confirmDelete(name);
    if (confirmed) {
      try {
        await deleteCustomer(id).unwrap();
        alerts.toastSuccess("Client deleted successfully!");
        setSelectedContacts(prev => prev.filter(cId => cId !== id));
      } catch (err: any) {
        alerts.error("Failed to delete client", err?.data?.message || err?.message);
      }
    }
  };

  const openEditModal = (contact: any) => {
    setEditingContactId(contact.id);
    setEditContactName(contact.name);
    setEditContactPhone(contact.phone);
    setShowEditContact(true);
  };

  const handleUpdateContact = async () => {
    if (!editingContactId || !editContactName.trim() || !editContactPhone.trim()) {
      alerts.error("Missing Fields", "Please enter name and phone number.");
      return;
    }
    
    let cleanName = editContactName.replace(/["']/g, '').trim();
    let formattedPhone = editContactPhone.replace(/["'\s\-()+]/g, '');
    
    if (formattedPhone.startsWith('63')) {
      formattedPhone = '+' + formattedPhone;
    } else if (formattedPhone.startsWith('09')) {
      formattedPhone = '+63' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('9')) {
      formattedPhone = '+63' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      await updateCustomer({ id: editingContactId, body: { name: cleanName, mobileNumber: formattedPhone } }).unwrap();
      alerts.toastSuccess("Client updated successfully!");
      setShowEditContact(false);
      setEditingContactId(null);
    } catch (err: any) {
      alerts.error("Failed to update client", err?.data?.message || err?.message);
    }
  };

  const handleExportCSV = () => {
    if (contacts.length === 0) return alerts.toastError("No clients to export");
    const csvContent = "Name,Phone,Group,Date Added\n" + contacts.map(c => `"${c.name}","${c.phone}","${c.group}","${c.dateAdded}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "clients_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (data: {name: string, phone: string}[]) => {
    if (data.length === 0) return;
    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;
    for (const item of data) {
      if (!item.name || !item.phone) continue;
      
      let cleanName = item.name.replace(/["']/g, '').trim();
      let formattedPhone = item.phone.replace(/["'\s\-()+]/g, '');
      
      if (formattedPhone.startsWith('63')) {
        formattedPhone = '+' + formattedPhone;
      } else if (formattedPhone.startsWith('09')) {
        formattedPhone = '+63' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('9')) {
        formattedPhone = '+63' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }

      try {
        await createCustomer({ name: cleanName, mobileNumber: formattedPhone }).unwrap();
        successCount++;
      } catch (e) {
        errorCount++;
      }
    }
    setIsImporting(false);
    setShowImportContacts(false);
    alerts.toastSuccess(`Imported ${successCount} clients. ${errorCount ? `Skipped ${errorCount} invalid/duplicate clients.` : ''}`);
    setPasteText('');
    setPasteName('');
    setUploadData([]);
    setManualRows([{ id: 1, name: '', phone: '' }, { id: 2, name: '', phone: '' }, { id: 3, name: '', phone: '' }]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        alerts.error("Invalid File", "File must contain a header row and at least one data row.");
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf('name');
      const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile'));
      
      if (nameIdx === -1 || phoneIdx === -1) {
        alerts.error("Invalid Format", "CSV must contain 'Name' and 'Phone' headers.");
        return;
      }
      
      const parsed = lines.slice(1).map(line => {
        const cols = line.split(',');
        return { name: cols[nameIdx]?.trim() || '', phone: cols[phoneIdx]?.trim() || '' };
      }).filter(row => row.name && row.phone);
      
      setUploadData(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <PageHeader 
        title="Clients" 
        subtitle="Manage your client database for SMS broadcasts and marketing."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-muted">Total Clients</p>
            <h3 className="text-2xl font-bold text-black">{isCustomersLoading ? '-' : (meta?.total || 0)}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="primary" className="font-bold gap-2 shadow-sm" onClick={() => setShowAddContact(true)}>
              <Plus size={16} /> Add Client
            </Button>
            <Button variant="outline" className="gap-2 font-medium bg-white border-border" onClick={() => setShowImportContacts(true)}>
              <Upload size={16} /> Import Clients
            </Button>
          </div>
          <Button variant="outline" onClick={handleExportCSV} className="gap-2 font-medium bg-white border-border w-full sm:w-auto">
            <Download size={16} /> Export CSV
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or phone..."
              className="w-full h-10 pl-10 pr-4 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {isCustomersLoading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-primary w-8 h-8 mx-auto" /></div>
        ) : contacts.length === 0 ? (
          <div className="bg-[#fafafa] border border-dashed border-border/60 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mb-4">
              <Package className="text-text-muted" size={24} />
            </div>
            <h3 className="font-bold text-lg text-black mb-2">No clients yet</h3>
            <p className="text-sm text-text-muted max-w-sm">
              Add them manually or import from a file to start building your client list.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            {selectedContacts.length > 0 && (
              <div className="bg-orange-50/50 p-4 border-b border-border flex items-center justify-between">
                <span className="text-primary font-bold">{selectedContacts.length} clients selected</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedContacts([])} className="text-sm text-text-muted hover:text-black underline">Clear selection</button>
                  <Button 
                    variant="primary" 
                    className="font-bold py-1.5 px-4 shadow-sm text-xs"
                    onClick={() => router.push(`/sms-broadcast?step=2&contacts=${selectedContacts.join(',')}`)}
                  >
                    Compose SMS &rarr;
                  </Button>
                </div>
              </div>
            )}
            <table className="w-full text-left">
              <thead className="bg-[#f8f9fa] border-b border-border text-xs font-semibold text-text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <button onClick={() => setSelectedContacts(selectedContacts.length === contacts.length ? [] : contacts.map(c => c.id))} className="text-primary">
                      {selectedContacts.length === contacts.length ? <CheckSquare size={18} className="fill-primary/20" /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="px-4 py-3">NAME</th>
                  <th className="px-4 py-3">PHONE NUMBER</th>
                  <th className="px-4 py-3">GROUP</th>
                  <th className="px-4 py-3">DATE ADDED</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => setSelectedContacts(prev => prev.includes(contact.id) ? prev.filter(id => id !== contact.id) : [...prev, contact.id])}
                        className={selectedContacts.includes(contact.id) ? "text-primary" : "text-text-muted"}
                      >
                        {selectedContacts.includes(contact.id) ? <CheckSquare size={18} className="fill-primary/20" /> : <Square size={18} />}
                      </button>
                    </td>
                    <td className="px-4 py-4 font-bold text-black">{contact.name}</td>
                    <td className="px-4 py-4 font-medium text-black">{contact.phone}</td>
                    <td className="px-4 py-4">
                      {contact.group && <span className="px-2.5 py-1 bg-[#f2f2f2] text-text-muted rounded-md text-xs font-bold">{contact.group}</span>}
                    </td>
                    <td className="px-4 py-4 text-text-muted">{contact.dateAdded}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 text-text-muted">
                        <button onClick={() => openEditModal(contact)} className="hover:text-primary transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteContact(contact.id, contact.name)} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {meta && totalPages > 1 && (
              <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8f9fa] text-sm text-text-muted rounded-b-xl">
                <div className="font-medium">
                  Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of <span className="font-bold text-black">{meta.total}</span> clients
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="h-8 px-3 text-xs bg-white border-border hover:bg-black/5 font-semibold" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={cn("w-8 h-8 rounded-md text-xs font-bold flex items-center justify-center transition-colors shrink-0", currentPage === i + 1 ? "bg-primary text-black shadow-sm" : "bg-white border border-border hover:bg-black/5 text-text-muted")}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-8 px-3 text-xs bg-white border-border hover:bg-black/5 font-semibold"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg text-black">Add New Client</h3>
              <button onClick={() => setShowAddContact(false)} className="text-text-muted hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Name *</label>
                <input 
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz" 
                  className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Phone Number *</label>
                <input 
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="+63 09XX XXX XXXX" 
                  className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <p className="text-xs text-text-muted">Formats accepted: 0917.., 917.., or +63917..</p>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-gray-50/50">
              <Button variant="ghost" onClick={() => setShowAddContact(false)} className="font-semibold text-text-primary hover:text-black">Cancel</Button>
              <Button variant="primary" onClick={handleAddContact} disabled={isCreating} className="font-bold px-6 shadow-sm">
                {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Add Client"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg text-black">Edit Client</h3>
              <button onClick={() => setShowEditContact(false)} className="text-text-muted hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Name *</label>
                <input 
                  value={editContactName}
                  onChange={e => setEditContactName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz" 
                  className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Phone Number *</label>
                <input 
                  value={editContactPhone}
                  onChange={e => setEditContactPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="+63 09XX XXX XXXX" 
                  className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                <p className="text-xs text-text-muted">Formats accepted: 0917.., 917.., or +63917..</p>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-gray-50/50">
              <Button variant="ghost" onClick={() => setShowEditContact(false)} className="font-semibold text-text-primary hover:text-black">Cancel</Button>
              <Button variant="primary" onClick={handleUpdateContact} disabled={isUpdating} className="font-bold px-6 shadow-sm">
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showImportContacts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="font-bold text-xl text-black">Import Clients</h3>
              <button onClick={() => setShowImportContacts(false)} className="text-text-muted hover:text-black">
                <X size={22} />
              </button>
            </div>
            
            <div className="flex items-center bg-[#f8f9fa] border-b border-border shrink-0 px-2 pt-2">
              <button 
                onClick={() => setImportTab('upload')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all rounded-t-lg mx-1",
                  importTab === 'upload' ? "bg-primary text-black" : "text-text-muted hover:text-black hover:bg-black/5"
                )}
              >
                <Upload size={16} /> File Upload
              </button>
              <button 
                onClick={() => setImportTab('paste')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all rounded-t-lg mx-1",
                  importTab === 'paste' ? "bg-primary text-black" : "text-text-muted hover:text-black hover:bg-black/5"
                )}
              >
                <FileText size={16} /> Paste Numbers
              </button>
              <button 
                onClick={() => setImportTab('manual')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all rounded-t-lg mx-1",
                  importTab === 'manual' ? "bg-primary text-black" : "text-text-muted hover:text-black hover:bg-black/5"
                )}
              >
                <UserPlus size={16} /> Manual Entry
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {importTab === 'upload' && (
                <div className="space-y-4 relative">
                  <div className="border-2 border-dashed border-border/80 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-[#fafafa] transition-colors hover:bg-black/5 cursor-pointer min-h-[300px] relative overflow-hidden">
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-border pointer-events-none">
                      <FileSpreadsheet className="text-primary" size={24} />
                    </div>
                    <h4 className="font-bold text-black text-lg mb-1 pointer-events-none">
                      {uploadData.length > 0 ? `Loaded ${uploadData.length} clients from CSV` : "Click to browse or drag & drop CSV file"}
                    </h4>
                    <p className="text-sm text-text-muted mb-4 pointer-events-none">Accepts .csv</p>
                    <p className="text-sm text-text-muted max-w-sm pointer-events-none">Make sure your file has column headers: <strong>Name</strong>, <strong>Phone</strong></p>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full py-3 font-bold rounded-xl"
                    disabled={uploadData.length === 0 || isImporting}
                    onClick={() => handleImport(uploadData)}
                  >
                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Import ${uploadData.length} Clients`}
                  </Button>
                </div>
              )}

              {importTab === 'paste' && (() => {
                const pastedNumbers = pasteText.split(/[\n,]+/).map(t => t.trim()).filter(Boolean);
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-text-muted">Name for all (Optional)</label>
                        <input 
                          value={pasteName}
                          onChange={e => setPasteName(e.target.value)}
                          placeholder="e.g. Website Lead" 
                          className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-text-muted">Phone Numbers</label>
                        <span className="text-xs font-bold text-text-muted">{pastedNumbers.length} valid numbers detected</span>
                      </div>
                      <textarea 
                        value={pasteText}
                        onChange={e => setPasteText(e.target.value)}
                        placeholder="Paste numbers here... One per line, or comma-separated. e.g. 09171234567 +639181234567" 
                        className="w-full h-48 p-4 bg-[#f2f2f2] border-none rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                      />
                    </div>
                    <Button 
                      variant="primary" 
                      className={cn("w-full py-3 font-bold rounded-xl", pastedNumbers.length === 0 && "opacity-60 pointer-events-none")}
                      disabled={pastedNumbers.length === 0 || isImporting}
                      onClick={() => handleImport(pastedNumbers.map((phone, i) => ({ name: pasteName || `Imported Contact ${i+1}`, phone })))}
                    >
                      {isImporting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Import ${pastedNumbers.length} Numbers`}
                    </Button>
                  </div>
                );
              })()}

              {importTab === 'manual' && (() => {
                const validRows = manualRows.filter(r => r.name && r.phone);
                return (
                <div className="space-y-6">
                  
                  <div className="space-y-3">
                    {manualRows.map((row, index) => (
                      <div key={row.id} className="flex gap-3 items-center">
                        <input 
                          placeholder="Name" 
                          className="flex-1 h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={row.name}
                          onChange={(e) => {
                            const newRows = [...manualRows];
                            newRows[index].name = e.target.value;
                            setManualRows(newRows);
                          }}
                        />
                        <input 
                          placeholder="Phone (09...)" 
                          className="flex-1 h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={row.phone}
                          onChange={(e) => {
                            const newRows = [...manualRows];
                            newRows[index].phone = e.target.value.replace(/[^0-9+]/g, '');
                            setManualRows(newRows);
                          }}
                        />
                        <button 
                          onClick={() => setManualRows(manualRows.filter(r => r.id !== row.id))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-danger bg-[#f2f2f2] hover:bg-danger/10"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="font-semibold text-primary hover:text-black gap-2 w-full border-2 border-dashed border-border"
                    onClick={() => setManualRows([...manualRows, { id: Date.now(), name: '', phone: '' }])}
                  >
                    <Plus size={16} /> Add Another Row
                  </Button>
                  <Button 
                    variant="primary" 
                    className="w-full py-3 font-bold rounded-xl mt-4"
                    disabled={validRows.length === 0 || isImporting}
                    onClick={() => handleImport(validRows)}
                  >
                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Import ${validRows.length} Clients`}
                  </Button>
                </div>
              );})()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
