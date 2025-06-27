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