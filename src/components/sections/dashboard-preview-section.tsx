'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

const chartData = [
  { name: 'Jan', total: Math.floor(Math.random() * 20) + 10 },
  { name: 'Feb', total: Math.floor(Math.random() * 20) + 10 },
  { name: 'Mar', total: Math.floor(Math.random() * 20) + 10 },
  { name: 'Apr', total: Math.floor(Math.random() * 20) + 10 },
  { name: 'May', total: Math.floor(Math.random() * 20) + 10 },
  { name: 'Jun', total: Math.floor(Math.random() * 20) + 10 },
];

export default function DashboardPreviewSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="dashboard" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboards for Every Role
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Custom-tailored insights for employees, managers, and administrators.
          </p>
        </div>

        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="employee">Employee</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <div className="bg-card/30 p-2 sm:p-4 rounded-xl border-2 sm:border-4 border-card/50 shadow-2xl shadow-black/5">
            <TabsContent value="employee" className="mt-0">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>My Development Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Leadership Skills</p>
                      <p className="text-muted-foreground">75%</p>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Advanced React</p>
                      <p className="text-muted-foreground">50%</p>
                    </div>
                    <Progress value={50} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Public Speaking</p>
                      <p className="text-muted-foreground">25%</p>
                    </div>
                    <Progress value={25} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="manager" className="mt-0">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>Team Skill Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {isClient && (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin" className="mt-0">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle>Organization-Wide Analytics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">IDPs Active</p>
                    <p className="text-2xl sm:text-3xl font-bold">1,254</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Top Skill</p>
                    <p className="text-2xl sm:text-3xl font-bold">Python</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold">82%</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
