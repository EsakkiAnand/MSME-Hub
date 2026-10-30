import { Link } from 'react-router-dom';
import {
  FileText,
  LayoutDashboard,
  Kanban,
  ArrowLeft,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SubmitProblemPlaceholder() {
  return (
    <div className="py-28 sm:py-36 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mx-auto mb-6 shadow-md">
          <FileText className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-blue-100 text-blue-900 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          Assigned to Member 2
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
          Industry Problem Submission Form
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          This route (<code className="text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-mono">/submit-problem</code>) is reserved for Member 2 to integrate the 1-Minute Intake Form, Company Details, Sector Selector, and File Upload UI.
        </p>

        <Card className="mt-8 text-left border-dashed border-2 border-slate-300">
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-600" /> Member 2 Checklist:
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-2">
              <li>• Enterprise and Contact details form fields (using Member 1's <code className="text-blue-800">Input</code> components)</li>
              <li>• Industry & Problem Category dropdown selectors</li>
              <li>• Problem description, impact, and optional file upload UI</li>
              <li>• Academic consent disclaimer checkbox & submission confirmation screen</li>
            </ul>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/design-system">
            <Button variant="primary">
              View UI Kit Components
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPlaceholder() {
  return (
    <div className="py-28 sm:py-36 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-6 shadow-md">
          <LayoutDashboard className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-amber-100 text-amber-900 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          Assigned to Member 3
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
          Staff Admin Dashboard & Problem Bank
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          This route (<code className="text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-mono">/admin</code> & <code className="text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-mono">/problem-bank</code>) is reserved for Member 3 to implement the Staff Login, Summary Metrics, Filterable Problem Bank, and Review Flow.
        </p>

        <Card className="mt-8 text-left border-dashed border-2 border-slate-300">
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-amber-600" /> Member 3 Checklist:
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-2">
              <li>• Staff authentication UI & protected route guard</li>
              <li>• Metric summary cards (Total Problems, Pending, Accepted, Completed)</li>
              <li>• Problem Bank table with search, sector filter, and sorting</li>
              <li>• Status badges (using Member 1's <code className="text-blue-800">ProblemStatusBadge</code>)</li>
              <li>• Problem detail modal with review action buttons (Accept, Clarify, Reject)</li>
            </ul>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/design-system">
            <Button variant="primary">
              View UI Kit Components
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProjectTrackingPlaceholder() {
  return (
    <div className="py-28 sm:py-36 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="h-16 w-16 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-6 shadow-md">
          <Kanban className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-purple-100 text-purple-900 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          Assigned to Member 4
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
          Project Tracking & Stage Gates (G0–G10)
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          This route (<code className="text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-mono">/track-status</code>) is reserved for Member 4 to implement the Student Team Assignment, Faculty Mentor Matching, and Milestone Progression Timeline.
        </p>

        <Card className="mt-8 text-left border-dashed border-2 border-slate-300">
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-600" /> Member 4 Checklist:
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-2">
              <li>• Project Details page with unique tracking ID input</li>
              <li>• Student team and faculty mentor assignment cards</li>
              <li>• Milestone progress tracker through stage gates G0 to G10</li>
              <li>• Activity timeline with follow-up visit notes and deliverable uploads</li>
              <li>• Overall frontend integration & responsive polish</li>
            </ul>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/design-system">
            <Button variant="primary">
              View UI Kit Components
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

