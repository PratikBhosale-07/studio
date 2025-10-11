'use client';

import { Bar, BarChart, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const barChartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const lineChartData = [
  { average: 10, today: 15 },
  { average: 15, today: 20 },
  { average: 20, today: 22 },
  { average: 25, today: 30 },
  { average: 30, today: 35 },
];

const radarChartData = [
  { subject: 'Leadership', A: 120, B: 110, fullMark: 150 },
  { subject: 'Comms', A: 98, B: 130, fullMark: 150 },
  { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
  { subject: 'Project Mgmt', A: 99, B: 100, fullMark: 150 },
  { subject: 'UX Design', A: 85, B: 90, fullMark: 150 },
];

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Data-Driven Development
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Track progress and measure the impact of your talent strategies.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Skill Adoption Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  desktop: { label: 'Skills', color: 'hsl(var(--primary))' },
                }}
                className="h-[250px] w-full"
              >
                <BarChart accessibilityLayer data={barChartData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Team vs. Average</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  average: { label: 'Average', color: 'hsl(var(--secondary-foreground))' },
                  today: { label: 'Your Team', color: 'hsl(var(--primary))' },
                }}
                className="h-[250px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={lineChartData}
                  margin={{ top: 20, left: -20, right: 20, bottom: 0 }}
                >
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="average" stroke="var(--color-average)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="today" stroke="var(--color-today)" strokeWidth={3} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Competency Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar name="Your Team" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <Radar name="Company Avg" dataKey="B" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
