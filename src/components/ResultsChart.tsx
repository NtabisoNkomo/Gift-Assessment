'use client';

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { GiftScore } from '@/lib/scoring';

export function RadarAnalysis({ data }: { data: GiftScore[] }) {
  const chartData = data.map(d => ({
    subject: d.gift.name,
    A: d.percentage,
    fullMark: 100,
  }));

  return (
    <div className="w-full flex items-center justify-center py-4">
      {/* Fixed size avoids ResponsiveContainer ResizeObserver issues in PDF */}
      <RadarChart cx={250} cy={220} outerRadius={150} width={500} height={450} data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }}
          className="text-slate-600 dark:text-slate-400"
        />
        <Tooltip 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${value}%`, 'Match']}
           contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Radar 
          name="Strength" 
          dataKey="A" 
          stroke="#0ea5e9" 
          strokeWidth={3}
          fill="#0ea5e9" 
          fillOpacity={0.4} 
          animationDuration={1000}
          isAnimationActive={true}
        />
      </RadarChart>
    </div>
  );
}

export function BarAnalysis({ data }: { data: GiftScore[] }) {
  const chartData = data.map(d => ({
    name: d.gift.name,
    score: d.score,
  }));

  return (
    <div className="w-full h-[800px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis type="number" domain={[0, 15]} hide />
          <YAxis dataKey="name" type="category" width={100} className="text-xs font-medium fill-slate-600 dark:fill-slate-400" />
          <Tooltip 
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', background: 'var(--card)', color: 'var(--foreground)' }}
          />
          <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
