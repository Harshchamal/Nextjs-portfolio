import fs from 'fs';
import path from 'path';
import { isAuthed } from '@/lib/auth';
import LoginForm from './LoginForm';
import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  if (!isAuthed()) {
    return <LoginForm />;
  }

  const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
  const initialProjects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

  return <DashboardClient initialProjects={initialProjects} />;
}
