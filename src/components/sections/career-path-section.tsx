import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle } from 'lucide-react';

const careerPath = [
  {
    role: 'Junior Developer',
    description: 'Build foundational coding skills and contribute to projects.',
    status: 'completed',
  },
  {
    role: 'Software Engineer',
    description: 'Take ownership of features and mentor junior developers.',
    status: 'current',
  },
  {
    role: 'Senior Engineer',
    description: 'Lead technical design and architectural decisions.',
    status: 'next',
  },
  {
    role: 'Tech Lead',
    description: 'Guide a team of engineers and drive project execution.',
    status: 'next',
  },
  {
    role: 'Engineering Manager',
    description: 'Focus on people management, strategy, and team growth.',
    status: 'next',
  },
];

const Node = ({ role, description, status, isLast }: { role: string; description: string; status: string; isLast: boolean }) => {
  const statusStyles = {
    completed: 'bg-primary/20 border-primary text-primary-foreground',
    current: 'bg-accent/20 border-accent text-accent-foreground scale-110 shadow-lg shadow-accent/20',
    next: 'bg-secondary border-border',
  };

  return (
    <div className="relative flex-1 min-w-[12rem]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`rounded-lg p-4 text-center transition-all duration-300 ${statusStyles[status as keyof typeof statusStyles]}`}
            >
              <h4 className="font-semibold">{role}</h4>
              {status === 'completed' && <CheckCircle className="mx-auto mt-2 h-5 w-5 text-primary" />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {!isLast && (
        <div className="absolute top-1/2 left-full h-0.5 w-full bg-border -translate-y-1/2" />
      )}
    </div>
  );
};

export default function CareerPathSection() {
  return (
    <section id="career-path" className="py-20 sm:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Visualize Your Career Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Interactive roadmaps show you what's next and how to get there.
          </p>
        </div>
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-0 overflow-x-auto pb-8 -mb-8">
            {careerPath.map((node, index) => (
              <Node
                key={node.role}
                role={node.role}
                description={node.description}
                status={node.status}
                isLast={index === careerPath.length - 1}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-border -translate-y-1/2 -z-10 hidden md:block" />
        </div>
      </div>
    </section>
  );
}
