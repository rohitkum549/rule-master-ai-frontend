export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface TableRow {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  projectName: string;
  team: TeamMember[];
  status: 'Active' | 'Pending' | 'Cancel';
  budget: string;
}

export type TableData = TableRow[];

// Rule type definitions
export interface Rule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  category: string;
  createdAt: string;
  status: 'Active' | 'Inactive' | 'Draft';
}

export type RulesData = Rule[]; 