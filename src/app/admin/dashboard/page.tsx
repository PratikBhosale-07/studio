
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FirebaseClientProvider, useUser } from '@/firebase';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Sector, Tooltip } from 'recharts';
import { Users, Target, Briefcase } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const overallStats = [
    { name: 'Total Users', value: '1,420', icon: <Users className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Active IDPs', value: '1,120', icon: <Target className="w-4 h-4 text-muted-foreground" /> },
    { name: 'Departments', value: '15', icon: <Briefcase className="w-4 h-4 text-muted-foreground" /> },
]

const engagementData = [
  { name: 'Q1', engagement: 65 },
  { name: 'Q2', engagement: 72 },
  { name: 'Q3', engagement: 78 },
  { name: 'Q4', engagement: 85 },
];

const roleDistributionData = [
  { name: 'Employees', value: 1200 },
  { name: 'Managers', value: 200 },
  { name: 'Admins', value: 20 },
];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="hsl(var(--foreground))">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))">{`${value} Users`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


function AdminDashboardContent() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const auth = getAuth();
  const router = useRouter();

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, [setActiveIndex]);
  
  useAuthGuard();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Update Datasets
            </Button>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {overallStats.map(stat => (
                 <Card key={stat.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                 </Card>
             ))}
          </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>User Engagement Over Time</CardTitle>
                   <CardDescription>Platform engagement trends across quarters.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isClient && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={engagementData}>
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                           <Tooltip
                            cursor={{fill: 'hsl(var(--muted))'}}
                            contentStyle={{ 
                                background: 'hsl(var(--background))', 
                                border: '1px solid hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                          />
                          <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Role Distribution</CardTitle>
                    <CardDescription>Breakdown of user roles in the system.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {isClient && (
                      <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                               <Tooltip
                                cursor={{fill: 'hsl(var(--muted))'}}
                                contentStyle={{ 
                                    background: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                }}
                              />
                              <Pie 
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={roleDistributionData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60}
                                outerRadius={80} 
                                dataKey="value" 
                                onMouseEnter={onPieEnter}
                              >
                                  {roleDistributionData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                          </PieChart>
                      </ResponsiveContainer>
                    )}
                 </CardContent>
              </Card>
           </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
    return (
        <FirebaseClientProvider>
            <AdminDashboardContent />
        </FirebaseClientProvider>
    )
}
