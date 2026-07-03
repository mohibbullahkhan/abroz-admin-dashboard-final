// The Push Notifications feature has no backend API support.
// The backend supports bulk SMS messaging via POST /broadcast.
// This route permanently redirects to the SMS Broadcast page.
import { redirect } from 'next/navigation';

export default function NotificationsPage() {
  redirect('/sms-broadcast');
}
