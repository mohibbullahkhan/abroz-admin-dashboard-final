'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Bell, 
  Clock, 
  Smartphone, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockNotifications } from '@/lib/data/mockData';
import { cn, formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Push Notifications" 
        subtitle="Broadcase announcements and updates to all Abroz Parts+ app users."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Composer */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Send size={20} className="text-primary" />
                Notification Composer
              </h3>
            </CardHeader>
            <CardBody className="space-y-6">
              <Input 
                label="Notification Title" 
                placeholder="e.g. 🆕 New Hydraulic Parts Available" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Notification Message</label>
                <textarea 
                  className="w-full min-h-[120px] bg-white/5 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="p-4 bg-white/5 border border-dashed border-border rounded-lg flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Add Optional Image</p>
                    <p className="text-[10px] text-text-muted">Recommended: 1024x512px</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8">Browse</Button>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Schedule Message</p>
                      <p className="text-[10px] text-text-muted">Send at a specific time</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={cn(
                      "w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                      isScheduled ? "bg-primary" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      isScheduled ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                    <Input type="date" label="Date" />
                    <Input type="time" label="Time" />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button variant="primary" className="w-full py-6 text-base font-bold uppercase tracking-widest amber-glow">
                  {isScheduled ? 'Schedule Notification' : 'Send Push Notification Now'}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Device Preview */}
          <Card className="bg-[#050505] border-white/5 overflow-hidden">
            <CardBody className="p-0 relative h-[400px] flex items-center justify-center">
              {/* Phone Mockup Frame */}
              <div className="relative w-[240px] h-[360px] bg-black border-[6px] border-[#222] rounded-[40px] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#222] rounded-b-xl z-20" />
                
                {/* Screen Content */}
                <div className="h-full w-full bg-[#111] p-4 pt-8">
                  {/* Lock Screen Notification */}
                  {(title || message) && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/5 animate-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                            <Smartphone size={10} className="text-black" />
                          </div>
                          <span className="text-[10px] text-white/60 font-medium">ABROZ PARTS+</span>
                        </div>
                        <span className="text-[10px] text-white/40">now</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{title || 'Notification Title'}</h4>
                      <p className="text-[10px] text-white/80 line-clamp-2 mt-0.5">{message || 'Your notification message content will appear here...'}</p>
                    </div>
                  )}

                  {/* Wallper Placeholder */}
                  {!title && !message && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                      <Smartphone size={40} className="mb-2" />
                      <p className="text-[10px]">Preview on Device</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-6 left-6">
                <Badge variant="neutral" className="bg-black/50 backdrop-blur-md border-white/10">PREVIEW ON iOS/ANDROID</Badge>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - History */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Sent History</h3>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-border">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          notif.status === 'Sent' ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                        )}>
                          {notif.status === 'Sent' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </div>
                        <Badge variant={notif.status === 'Sent' ? 'success' : 'amber'} className="text-[8px] px-1.5 h-4">
                          {notif.status.toUpperCase()}
                        </Badge>
                      </div>
                      <button className="text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-1">{notif.title}</h4>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">{notif.message}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(notif.date)}
                      </span>
                      <span className="text-[10px] text-primary font-bold">1,248 DELIVERED</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
