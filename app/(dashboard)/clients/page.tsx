'use client';

import React, { useState } from 'react';
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

  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomersQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers = customersData?.data || [];
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
    
    let formattedPhone = newContactPhone.trim();
    if (formattedPhone.startsWith('09')) {
      formattedPhone = '+63' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('9')) {
      formattedPhone = '+63' + formattedPhone;
    } else if (!formattedPhone.startsWith('+63')) {
      formattedPhone = '+63' + formattedPhone.replace(/^\+?/, '');
    }

    try {
      await createCustomer({ name: newContactName, mobileNumber: formattedPhone }).unwrap();
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
    
    let formattedPhone = editContactPhone.trim();
    if (formattedPhone.startsWith('09')) {
      formattedPhone = '+63' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('9')) {
      formattedPhone = '+63' + formattedPhone;
    } else if (!formattedPhone.startsWith('+63')) {
      formattedPhone = '+63' + formattedPhone.replace(/^\+?/, '');
    }

    try {
      await updateCustomer({ id: editingContactId, body: { name: editContactName, mobileNumber: formattedPhone } }).unwrap();
      alerts.toastSuccess("Client updated successfully!");
      setShowEditContact(false);
      setEditingContactId(null);
    } catch (err: any) {
      alerts.error("Failed to update client", err?.data?.message || err?.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <PageHeader 
        title="Clients" 
        subtitle="Manage your client database for SMS broadcasts and marketing."
      />

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
          <Button variant="outline" className="gap-2 font-medium bg-white border-border w-full sm:w-auto">
            <Download size={16} /> Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              placeholder="Search by name or phone..."
              className="w-full h-10 pl-10 pr-4 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="w-full sm:w-48 shrink-0">
            <select className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Group: All</option>
            </select>
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
                <button onClick={() => setSelectedContacts([])} className="text-sm text-text-muted hover:text-black underline">Clear selection</button>
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
                  onChange={e => setNewContactPhone(e.target.value)}
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
                  onChange={e => setEditContactPhone(e.target.value)}
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
                <div className="border-2 border-dashed border-border/80 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-[#fafafa] transition-colors hover:bg-black/5 cursor-pointer min-h-[300px]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
                    <FileSpreadsheet className="text-primary" size={24} />
                  </div>
                  <h4 className="font-bold text-black text-lg mb-1">Drag & drop your file here, or click to browse</h4>
                  <p className="text-sm text-text-muted mb-4">Accepts .csv, .xlsx, .xls</p>
                  <p className="text-sm text-text-muted max-w-sm">Make sure your file has column headers: <strong>Name</strong>, <strong>Phone</strong>, and <strong>Group</strong> (optional).</p>
                </div>
              )}

              {importTab === 'paste' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-muted">Name for all (Optional)</label>
                      <input placeholder="e.g. Website Lead" className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-muted">Group (Optional)</label>
                      <input placeholder="e.g. June Leads" className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-text-muted">Phone Numbers</label>
                      <span className="text-xs font-bold text-text-muted">0 valid numbers detected</span>
                    </div>
                    <textarea 
                      placeholder="Paste numbers here... One per line, or comma-separated. e.g. 09171234567 +639181234567" 
                      className="w-full h-48 p-4 bg-[#f2f2f2] border-none rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                    />
                  </div>
                  <Button variant="primary" className="w-full py-3 font-bold opacity-60 pointer-events-none rounded-xl">
                    Import 0 Numbers
                  </Button>
                </div>
              )}

              {importTab === 'manual' && (
                <div className="space-y-6">
                  <div className="space-y-1.5 max-w-sm">
                    <label className="text-sm font-medium text-text-muted">Group for all these clients (Optional)</label>
                    <input placeholder="e.g. VIP Event" className="w-full h-10 px-3 bg-[#f2f2f2] border-none rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  
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
                            newRows[index].phone = e.target.value;
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
                  <Button variant="primary" className="w-full py-3 font-bold rounded-xl mt-4">
                    Import {manualRows.filter(r => r.name && r.phone).length} Clients
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
