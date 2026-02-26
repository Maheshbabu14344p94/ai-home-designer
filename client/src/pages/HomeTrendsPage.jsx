import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const yearlyPriceTrend = [
  { year: '2020', avgPrice: 3200 },
  { year: '2021', avgPrice: 3550 },
  { year: '2022', avgPrice: 3900 },
  { year: '2023', avgPrice: 4350 },
  { year: '2024', avgPrice: 4900 },
  { year: '2025', avgPrice: 5450 },
  { year: '2026', avgPrice: 6100 },
];

const demandByType = [
  { name: '2BHK', value: 38 },
  { name: '3BHK', value: 34 },
  { name: '4BHK', value: 16 },
  { name: 'Villas', value: 12 },
];

const locationGrowth = [
  { location: 'City Core', growth: 14 },
  { location: 'Suburbs', growth: 18 },
  { location: 'Highway Belt', growth: 22 },
  { location: 'Smart Zone', growth: 26 },
];

const createDailyProjection = (startAmount = 600000, dailyRate = 0.0035, days = 30) => {
  const result = [];
  let amount = startAmount;

  for (let d = 1; d <= days; d += 1) {
    amount = amount * (1 + dailyRate);
    result.push({
      day: `D${d}`,
      amount: Math.round(amount),
    });
  }
  return result;
};

const HomeTrendsPage = () => {
  const dailyProjection = useMemo(() => createDailyProjection(600000, 0.0035, 30), []);
  const latestYear = yearlyPriceTrend[yearlyPriceTrend.length - 1];
  const previousYear = yearlyPriceTrend[yearlyPriceTrend.length - 2];

  const yoyGrowth = Math.round(((latestYear.avgPrice - previousYear.avgPrice) / previousYear.avgPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <h1 className="text-3xl font-bold">Home Market Insights & Trends</h1>
        <p className="opacity-90 mt-2">
          Year-wise trends, demand charts, and day-by-day budget growth projections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Current Avg Price / sq.ft</p>
          <p className="text-2xl font-bold">₹{latestYear.avgPrice}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">YoY Growth</p>
          <p className="text-2xl font-bold text-emerald-600">{yoyGrowth}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">30-Day Projection (₹6,00,000 base)</p>
          <p className="text-2xl font-bold">
            ₹{dailyProjection[dailyProjection.length - 1]?.amount?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h2 className="font-semibold mb-3">Year-wise Average Price Trend</h2>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={yearlyPriceTrend}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="avgPrice" stroke="#4f46e5" fill="url(#priceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="font-semibold mb-3">Demand by Home Type</h2>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={demandByType} dataKey="value" nameKey="name" outerRadius={110} label>
                  {demandByType.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="font-semibold mb-3">Growth by Location (%)</h2>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={locationGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growth" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h2 className="font-semibold mb-3">Day-by-Day Amount Increase Projection</h2>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={dailyProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomeTrendsPage;