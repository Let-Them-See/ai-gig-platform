import { redirect } from 'next/navigation';

export default function ProposalRedirectPage() {
  redirect('/dashboard/proposals');
}
