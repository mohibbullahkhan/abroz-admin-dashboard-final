'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { 
  MessageSquare, 
  History, 
  Gift, 
  Calendar as CalendarIcon, 
  MessageCircle, 
  Moon, 
  Zap, 
  Award, 
  CreditCard, 
  Wrench, 
  Package, 
  Rocket, 
  Store, 
  Clock, 
  Star, 
  HeartHandshake, 
  Edit3,
  Search,
  CheckSquare,
  Square,
  Users,
  Calendar,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { alerts } from '@/lib/sweetalert';
import { 
  useGetCustomersQuery, 
  useCreateBroadcastMutation
} from '@/store/services/customersApi';

type Category = 'All' | 'Greetings' | 'Promotions' | 'Reminders' | 'Announcements' | 'Follow Ups' | 'Custom';

interface Template {
  id: string;
  title: string;
  category: Category;
  description: string;
  content: string;
  icon: React.ReactNode;
}

const TEMPLATES: Template[] = [
  { id: '1', title: 'Birthday Wish', category: 'Greetings', description: 'Warm birthday greetings for your customers', content: 'Happy Birthday, [Name]! 🎂 Wishing you a wonderful day filled with joy.', icon: <Gift className="text-amber-500 w-6 h-6" /> },
  { id: '2', title: 'New Year Greeting', category: 'Greetings', description: 'Ring in the New Year with your clients', content: 'Happy New Year, [Name]! 🎆 Wishing you prosperity, good health...', icon: <CalendarIcon className="text-blue-500 w-6 h-6" /> },
  { id: '3', title: 'Christmas Greeting', category: 'Greetings', description: 'Spread holiday cheer to your customers', content: 'Merry Christmas, [Name]! 🎄 May this holiday season bring yo...', icon: <MessageCircle className="text-green-500 w-6 h-6" /> },
  { id: '4', title: 'Eid Greeting', category: 'Greetings', description: 'Eid Mubarak to your Muslim customers', content: 'Eid Mubarak, [Name]! 🌙 May this blessed occasion bring you...', icon: <Moon className="text-yellow-500 w-6 h-6" /> },
  { id: '5', title: 'Special Offer', category: 'Promotions', description: 'Announce a limited-time deal', content: 'Hi [Name]! 🔥 We have a SPECIAL OFFER just for you — exclusi...', icon: <Zap className="text-orange-500 w-6 h-6" /> },
  { id: '6', title: 'Flash Sale', category: 'Promotions', description: 'Urgent flash sale announcement', content: '⚡ FLASH SALE ALERT, [Name]! Limited stocks available at unbea...', icon: <Zap className="text-red-500 w-6 h-6" /> },
  { id: '7', title: 'Loyalty Reward', category: 'Follow Ups', description: 'Reward your loyal customers', content: "Hi [Name]! 🏆 As one of our most valued customers, you've ea...", icon: <Award className="text-yellow-500 w-6 h-6" /> },
  { id: '8', title: 'Payment Reminder', category: 'Reminders', description: 'Gentle payment due reminder', content: 'Dear [Name], this is a friendly reminder that your payment is due soon.', icon: <CreditCard className="text-blue-400 w-6 h-6" /> },
  { id: '9', title: 'Service Due Reminder', category: 'Reminders', description: 'Remind clients about scheduled maintenance', content: 'Hi [Name]! 🔧 Your equipment service/maintenance is due soon...', icon: <Wrench className="text-gray-500 w-6 h-6" /> },
  { id: '10', title: 'Order Ready', category: 'Reminders', description: 'Notify customer their order is ready', content: 'Good news, [Name]! 📦 Your order from Abroz Machinery is rea...', icon: <Package className="text-amber-600 w-6 h-6" /> },
  { id: '11', title: 'New Product Launch', category: 'Announcements', description: 'Announce a new product or part', content: "Hi [Name]! 🚀 We're excited to announce that new products ha...", icon: <Rocket className="text-indigo-500 w-6 h-6" /> },
  { id: '12', title: 'Branch Opening', category: 'Announcements', description: 'New branch or office announcement', content: "Big news, [Name]! 🏢 Abroz Machinery is expanding! We've ope...", icon: <Store className="text-pink-500 w-6 h-6" /> },
  { id: '13', title: 'Holiday Hours', category: 'Announcements', description: 'Inform customers of holiday business hours', content: 'Hi [Name]! 🗓️ Please note that Abroz Machinery will have ad...', icon: <Clock className="text-blue-500 w-6 h-6" /> },
  { id: '14', title: 'Post-Purchase Follow Up', category: 'Follow Ups', description: 'Check in after a purchase', content: "Hi [Name]! ⭐ We hope you're satisfied with your recent purc...", icon: <Star className="text-yellow-400 w-6 h-6" /> },
  { id: '15', title: 'Re-engagement', category: 'Follow Ups', description: 'Reconnect with inactive customers', content: "Hey [Name]! 👋 We've missed you at Abroz Machinery! It's bee...", icon: <HeartHandshake className="text-red-400 w-6 h-6" /> },
  { id: '16', title: 'Custom Message', category: 'Custom', description: 'Write your own personalized message', content: '', icon: <Edit3 className="text-orange-500 w-6 h-6" /> },
];

const CATEGORIES: Category[] = ['All', 'Greetings', 'Promotions', 'Reminders', 'Announcements', 'Follow Ups', 'Custom'];

export default function SmsBroadcastPage() {
  const [activeTab, setActiveTab] = useState<'New Broadcast' | 'Broadcast History'>('New Broadcast');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // API hooks
  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomersQuery();
  const [createBroadcast, { isLoading: isBroadcasting }] = useCreateBroadcastMutation();

  const customers = customersData?.data || [];
  const contacts = customers.map(c => ({
    id: c._id,
    name: c.name,
    phone: c.mobileNumber,
    group: 'All', // We don't have group on backend yet
    dateAdded: new Date(c.createdAt).toLocaleDateString()
  })).filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredTemplates = TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const activeTemplate = TEMPLATES.find(t => t.content === message) as Template | undefined;
  const smsParts = Math.max(1, Math.ceil(message.length / 160));

  const insertVariable = (variable: string) => {
    setMessage((prev) => prev + variable);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <PageHeader 
        title="SMS Broadcast" 
        subtitle="Send personalized text messages to your clients."
      />

      <div className="flex items-center gap-8 border-b border-border">
        <button
          onClick={() => setActiveTab('New Broadcast')}
          className={cn(
            "pb-4 flex items-center gap-2 font-semibold text-sm transition-colors relative",
            activeTab === 'New Broadcast' ? "text-primary" : "text-text-muted hover:text-black"
          )}
        >
          <MessageSquare size={16} /> New Broadcast
          {activeTab === 'New Broadcast' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('Broadcast History')}
          className={cn(
            "pb-4 flex items-center gap-2 font-semibold text-sm transition-colors relative",
            activeTab === 'Broadcast History' ? "text-primary" : "text-text-muted hover:text-black"
          )}
        >
          <History size={16} /> Broadcast History
          {activeTab === 'Broadcast History' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'New Broadcast' && (
        <div className="space-y-8">
          {/* Steps */}
          <div className="flex items-center justify-center max-w-2xl mx-auto py-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", step >= 1 ? "bg-primary text-black" : "bg-white/5 border border-border text-text-muted")}>
                {step > 1 ? <Check size={16} strokeWidth={3} /> : "1"}
              </div>
              <span className={cn("font-bold text-sm transition-colors", step >= 1 ? "text-primary" : "text-text-muted")}>Select Contacts</span>
            </div>
            <div className={cn("flex-1 h-px mx-4 transition-colors", step > 1 ? "bg-primary" : "bg-border")} />
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", step >= 2 ? "bg-primary text-black" : "bg-white/5 border border-border text-text-muted")}>
                {step > 2 ? <Check size={16} strokeWidth={3} /> : "2"}
              </div>
              <span className={cn("font-semibold text-sm transition-colors", step >= 2 ? "text-primary" : "text-text-muted")}>Compose Message</span>
            </div>
            <div className={cn("flex-1 h-px mx-4 transition-colors", step > 2 ? "bg-primary" : "bg-border")} />
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", step >= 3 ? "bg-primary text-black" : "bg-white/5 border border-border text-text-muted")}>
                {step > 3 ? <Check size={16} strokeWidth={3} /> : "3"}
              </div>
              <span className={cn("font-semibold text-sm transition-colors", step >= 3 ? "text-primary" : "text-text-muted")}>Review & Send</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

              {/* Empty State / Contacts Table */}
              {isCustomersLoading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-primary w-8 h-8 mx-auto" /></div>
              ) : contacts.length === 0 ? (
                <div className="bg-[#fafafa] border border-dashed border-border/60 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mb-4">
                    <Package className="text-text-muted" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-black mb-2">No contacts found</h3>
                  <p className="text-sm text-text-muted max-w-sm">
                    Go to the Clients page to manage your contact database.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  {selectedContacts.length > 0 && (
                    <div className="bg-orange-50/50 p-4 border-b border-border flex items-center justify-between">
                      <span className="text-primary font-bold">{selectedContacts.length} contacts selected</span>
                      <button onClick={() => setSelectedContacts([])} className="text-sm text-text-muted hover:text-black underline">Clear selection</button>
                    </div>
                  )}
                  <table className="w-full text-left">
                    <thead className="bg-[#f8f9fa] border-b border-border text-xs font-semibold text-text-muted uppercase">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <button onClick={() => setSelectedContacts(selectedContacts.length === contacts.length ? [] : contacts.map(c => c.id))} className="text-primary">
                            {selectedContacts.length === contacts.length && contacts.length > 0 ? <CheckSquare size={18} className="fill-primary/20" /> : <Square size={18} />}
                          </button>
                        </th>
                        <th className="px-4 py-3">NAME</th>
                        <th className="px-4 py-3">PHONE NUMBER</th>
                        <th className="px-4 py-3">GROUP</th>
                        <th className="px-4 py-3 text-right">DATE ADDED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {contacts.map(contact => (
                        <tr key={contact.id} className="hover:bg-black/5 transition-colors cursor-pointer" onClick={() => setSelectedContacts(prev => prev.includes(contact.id) ? prev.filter(id => id !== contact.id) : [...prev, contact.id])}>
                          <td className="px-4 py-4 text-center">
                            <button 
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
                          <td className="px-4 py-4 text-text-muted text-right">{contact.dateAdded}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex items-center justify-end pt-4 border-t border-border mt-8">
                <Button 
                  variant="primary" 
                  className={cn("font-bold px-8 py-2.5 shadow-sm transition-all", selectedContacts.length === 0 && "opacity-60 pointer-events-none")}
                  onClick={() => setStep(2)}
                >
                  Next: Compose Message &rarr;
                </Button>
              </div>

              {/* Floating selection pill */}
              {selectedContacts.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-border shadow-lg rounded-full px-6 py-3 flex items-center gap-3 z-40 animate-in slide-in-from-bottom-8">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded"><Users size={14} className="text-primary" /></span>
                    <span className="font-bold text-black">{selectedContacts.length} contacts selected</span>
                  </div>
                  <span className="text-text-muted">—</span>
                  <span className="text-text-muted text-sm">ready to receive your broadcast</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                      selectedCategory === cat 
                        ? "bg-primary border-primary text-black shadow-sm" 
                        : "bg-white/5 border-border text-text-muted hover:text-black hover:border-black/20"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => {
                  const isSelected = activeTemplate?.id === template.id;
                  return (
                    <Card 
                      key={template.id} 
                      hoverable 
                      className={cn("cursor-pointer transition-all bg-[#fafcfc] shadow-sm relative", isSelected ? "border-primary" : "border-border hover:border-primary/50")}
                      onClick={() => setMessage(template.content)}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black shadow-sm">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      <CardBody className="p-6 text-center space-y-3">
                        <div className="flex justify-center mb-2">
                          {template.icon}
                        </div>
                        <h3 className="font-bold text-black">{template.title}</h3>
                        <p className="text-xs text-text-muted">{template.description}</p>
                        <div className="h-px w-full bg-border/50 my-2" />
                        <p className="text-xs italic text-text-muted line-clamp-2 mt-2 text-center">
                          "{template.content || 'Write your own personalized message'}"
                        </p>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>

              {/* Message Composer */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-black text-lg">Message Content</h3>
                  <span className={cn("text-sm font-semibold", message.length > 1000 ? "text-red-500" : "text-emerald-500")}>
                    {message.length} / 1000 chars
                  </span>
                </div>
                
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full min-h-[120px] bg-[#f2f2f2] border-none rounded-xl p-4 text-black focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-text-muted">Insert variable:</span>
                    <button 
                      onClick={() => insertVariable('[Name]')}
                      className="px-3 py-1.5 bg-[#f2f2f2] hover:bg-[#e5e5e5] rounded-md text-xs font-bold text-black transition-colors"
                    >
                      [Name]
                    </button>
                    <p className="text-xs text-text-muted ml-2 flex items-center gap-1">
                      <Zap size={12} className="text-primary" />
                      <strong>[Name]</strong> will be replaced with each recipient's name when sent.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="font-bold px-8 py-2.5 shadow-sm bg-white border-border"
                      onClick={() => setStep(1)}
                    >
                      &larr; Back
                    </Button>
                    <Button 
                      variant="primary" 
                      className={cn("font-bold px-8 py-2.5 shadow-sm transition-all", (message.length === 0 || message.length > 1000) && "opacity-60 pointer-events-none")}
                      onClick={() => setStep(3)}
                    >
                      Next: Review & Send &rarr;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Your Message */}
                <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <MessageSquare size={20} />
                    <h3 className="font-bold text-lg">Your Message</h3>
                  </div>
                  <div className="bg-[#f2f2f2] rounded-xl p-5 mb-6 flex-1 text-sm text-black whitespace-pre-wrap relative">
                    {message || "No message content."}
                    <div className="absolute top-4 right-4 text-border opacity-20 pointer-events-none">
                      <MessageSquare size={48} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-muted pt-2 border-t border-border">
                    <span>Template: {activeTemplate?.title ?? 'Custom Message'}</span>
                    <span className="font-bold text-black">{message.length} chars • {smsParts} parts</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Recipients Card */}
                  <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <Users size={20} />
                      <h3 className="font-bold text-lg">Recipients ({selectedContacts.length})</h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-black">{contacts.find(c => c.id === selectedContacts[0])?.name || 'Contact'}</span>
                      <span className="text-text-muted text-sm">{contacts.find(c => c.id === selectedContacts[0])?.phone || ''}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-[#f2f2f2] text-text-muted text-xs font-bold rounded-md">
                        {contacts.find(c => c.id === selectedContacts[0])?.group || 'N/A'} (1)
                      </span>
                    </div>
                  </div>

                  {/* Delivery Time Card */}
                  <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-black">
                      <Calendar size={20} className="text-primary" />
                      <h3 className="font-bold text-lg">Delivery Time</h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        </div>
                        <span className="font-bold text-black text-sm">Send Now</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-text-muted">
                        <div className="w-5 h-5 rounded-full border-2 border-border" />
                        <span className="font-medium text-sm">Schedule for Later</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Card */}
              <div className="bg-[#faf7f2] border border-[#f5e6d3] rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-black text-lg mb-1">Estimated Delivery Overview</h3>
                  <p className="text-sm text-text-muted">
                    {selectedContacts.length} contacts &times; {smsParts} SMS parts per message = <span className="font-bold text-primary">{selectedContacts.length * smsParts} total SMS units</span>
                  </p>
                </div>
                <div className="flex items-start gap-2 text-text-muted max-w-[250px] text-right">
                  <Zap size={14} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-xs">Actual delivery speed depends on your SMS provider and recipient carriers.</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                <Button 
                  variant="outline" 
                  className="bg-white border border-border font-bold shadow-sm px-6"
                  onClick={() => setStep(2)}
                >
                  &larr; Back
                </Button>
                <Button 
                  variant="primary" 
                  className="font-bold px-12 py-3 shadow-sm text-base flex items-center gap-2"
                  disabled={isBroadcasting}
                  onClick={async () => {
                    const confirmed = await alerts.confirmAction(
                      'Confirm Broadcast',
                      `You are about to send a message to ${selectedContacts.length} contacts. This action cannot be undone.`,
                      'Yes, Send Now'
                    );
                    if (confirmed) {
                      try {
                        await createBroadcast({
                          customerIds: selectedContacts,
                          message: message
                        }).unwrap();
                        alerts.toastSuccess('Broadcast initiated successfully!');
                        setStep(1);
                        setMessage('');
                        setSelectedContacts([]);
                      } catch (err: any) {
                        alerts.toastError(err?.data?.message || 'Failed to dispatch broadcast');
                      }
                    }
                  }}
                >
                  {isBroadcasting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "🚀"} Send Broadcast to {selectedContacts.length} Contacts
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Broadcast History' && (
        <div className="py-20 text-center text-text-muted">
          Broadcast History (To be implemented)
        </div>
      )}
    </div>
  );
}
