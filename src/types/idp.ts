
export interface IndividualDevelopmentPlan {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    careerGoal: string;
    targetRole: string;
    currentSkills: string;
    skillsToDevelop: string;
    experienceSummary: string;
    goals: string[];
    startDate: string;
    endDate: string;
    status: 'In Progress' | 'Completed' | 'Not Started';
    managerFeedback?: string;
    skillGapAnalysis?: string;
}
