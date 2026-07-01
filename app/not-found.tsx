import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 animate-bounce">
        <Package size={40} />
      </div>
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
      <p className="text-text-muted max-w-md mb-10">
        The page you are looking for doesn't exist or has been moved. 
        Please check the URL or return to the dashboard.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg" className="px-12 font-bold uppercase tracking-widest shadow-lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
