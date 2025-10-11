
export interface IndividualDevelopmentPlan {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    careerGoal: string;
    targetRole: string;
    goals: string[];
    startDate: string;
    endDate: string;
    status: 'In Progress' | 'Completed' | 'Not Started';
    managerFeedback?: string;
    skillGapAnalysis?: string;
}
