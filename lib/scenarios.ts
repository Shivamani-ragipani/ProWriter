export interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  roleplayAs: string;
}

export const WORKPLACE_SCENARIOS: Scenario[] = [
  {
    id: 'status-update',
    title: 'Project Status Update',
    description: 'Send a status update to your manager about a project',
    context: 'You are working on a project that is slightly behind schedule. Your manager has asked for an update.',
    roleplayAs: 'Your manager'
  },
  {
    id: 'apology-email',
    title: 'Apology Email',
    description: 'Apologize for missing a deadline',
    context: 'You missed an important deadline for a deliverable. You need to apologize and explain the situation professionally.',
    roleplayAs: 'Your team lead'
  },
  {
    id: 'meeting-invite',
    title: 'Meeting Invitation',
    description: 'Invite colleagues to a meeting',
    context: 'You need to schedule a meeting with your team to discuss Q2 planning. Write a clear meeting invitation.',
    roleplayAs: 'Your colleague'
  },
  {
    id: 'slack-reply',
    title: 'Slack Quick Reply',
    description: 'Respond to a quick question on Slack',
    context: 'A colleague asks you on Slack if you can review their document. You are busy but want to be helpful.',
    roleplayAs: 'Your colleague'
  },
  {
    id: 'feedback-peer',
    title: 'Peer Feedback',
    description: 'Give constructive feedback to a colleague',
    context: 'Your colleague asked for feedback on their presentation. You found it informative but a bit too long.',
    roleplayAs: 'Your colleague'
  }
];
