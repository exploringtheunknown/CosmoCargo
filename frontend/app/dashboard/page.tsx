"use client";

import React from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Ship,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Sample data for charts
const deliveryData = [
  { name: "Jan", value: 125 },
  { name: "Feb", value: 167 },
  { name: "Mar", value: 184 },
  { name: "Apr", value: 156 },
  { name: "May", value: 198 },
  { name: "Jun", value: 237 },
  { name: "Jul", value: 263 },
];

const revenueData = [
  { name: "Jan", normal: 42000, express: 28000, priority: 14000 },
  { name: "Feb", normal: 48000, express: 32000, priority: 18000 },
  { name: "Mar", normal: 53000, express: 37000, priority: 22000 },
  { name: "Apr", normal: 51000, express: 42000, priority: 24000 },
  { name: "May", normal: 49000, express: 40000, priority: 26000 },
  { name: "Jun", normal: 57000, express: 44000, priority: 31000 },
  { name: "Jul", normal: 62000, express: 48000, priority: 35000 },
];

const destinationData = [
  { name: "Mars", value: 35 },
  { name: "Luna", value: 28 },
  { name: "Europa", value: 15 },
  { name: "Titan", value: 12 },
  { name: "Ganymede", value: 10 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#E5DEFF"];

const chartConfig = {
  shipments: {
    label: "Shipments",
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5",
    },
  },
  normal: {
    label: "Standard",
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5",
    },
  },
  express: {
    label: "Express",
    theme: {
      light: "#7E69AB",
      dark: "#7E69AB",
    },
  },
  priority: {
    label: "Priority",
    theme: {
      light: "#6E59A5",
      dark: "#6E59A5",
    },
  },
};

// Recent shipments data
const recentShipments = [
  {
    id: "CC-9385",
    destination: "Mars Colony Alpha",
    status: "In Transit",
    priority: "High",
    pilot: "Alex Chen",
  },
  {
    id: "CC-8754",
    destination: "Luna Base",
    status: "Delivered",
    priority: "Standard",
    pilot: "Sarah Kim",
  },
  {
    id: "CC-9127",
    destination: "Europa Station",
    status: "Preparing",
    priority: "Express",
    pilot: "Unassigned",
  },
  {
    id: "CC-8901",
    destination: "Titan Outpost",
    status: "In Transit",
    priority: "Standard",
    pilot: "Marcus Wong",
  },
  {
    id: "CC-9204",
    destination: "Ganymede Research",
    status: "Delayed",
    priority: "High",
    pilot: "Elena Petrova",
  },
];

const DashboardOverview: React.FC = () => {
  return (
    <>
    <div className="fixed z-1 top-0 left-0 w-full h-full flex items-center justify-center rotate-[-20deg] text-5xl pointer-events-none">WORK IN PROGRESS</div>

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-orbitron text-space-text-primary">
          Översikt
        </h1>
        <div className="text-sm text-space-text-secondary">
          <span>
            Uppdaterad: {new Date().toLocaleDateString("sv-SE")}{" "}
            {new Date().toLocaleTimeString("sv-SE")}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 opacity-40">
        <Card className="space-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron flex items-center space-x-2">
              <Package className="h-5 w-5 text-space-accent-purple" />
              <span>Aktiva Leveranser</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-space-text-primary">
              1,248
            </div>
            <p className="text-xs text-space-text-secondary mt-1">
              <span className="text-space-accent-purple flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +18% från förra månaden
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron flex items-center space-x-2">
              <Ship className="h-5 w-5 text-space-accent-purple" />
              <span>Piloter i tjänst</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-space-text-primary">
              87
            </div>
            <p className="text-xs text-space-text-secondary mt-1">
              <span className="text-space-accent-purple flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +5 sedan förra veckan
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-space-danger" />
              <span>Högriskfrakter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-space-text-primary">
              24
            </div>
            <p className="text-xs text-space-text-secondary mt-1">
              <span className="text-space-text-secondary flex items-center">
                1.9% av totala leveranser
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-orbitron flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Leveransprecision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-space-text-primary">
              98.6%
            </div>
            <p className="text-xs text-space-text-secondary mt-1">
              <span className="text-emerald-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +0.8% från förra
                kvartalet
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 opacity-40">
        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="font-orbitron">Leveranstrend</CardTitle>
            <CardDescription>
              Antal genomförda leveranser per månad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <AreaChart data={deliveryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="#8E9196" />
                  <YAxis stroke="#8E9196" />
                  <ChartTooltip
                    content={({
                      active,
                      payload,
                    }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-space-primary border border-space-secondary p-2 rounded">
                            <p className="text-sm">{`${payload[0].payload.name}: ${payload[0].value} leveranser`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="shipments"
                    stroke="#9b87f5"
                    fill="url(#colorGradient)"
                    activeDot={{ r: 8 }}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#9b87f5"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="font-orbitron">Intäktsöversikt</CardTitle>
            <CardDescription>
              Intäkter per servicenivå (i Kosmiska Krediter)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="name" stroke="#8E9196" />
                  <YAxis stroke="#8E9196" />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="normal" stackId="a" fill="#9b87f5" />
                  <Bar dataKey="express" stackId="a" fill="#7E69AB" />
                  <Bar dataKey="priority" stackId="a" fill="#6E59A5" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 opacity-40">
        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-orbitron">Senaste Leveranser</CardTitle>
            <CardDescription>
              De senaste 5 registrerade leveranserna
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-space-secondary hover:bg-space-secondary/30">
                  <TableHead className="text-space-text-secondary">
                    ID
                  </TableHead>
                  <TableHead className="text-space-text-secondary">
                    Destination
                  </TableHead>
                  <TableHead className="text-space-text-secondary">
                    Status
                  </TableHead>
                  <TableHead className="text-space-text-secondary">
                    Prioritet
                  </TableHead>
                  <TableHead className="text-space-text-secondary">
                    Pilot
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentShipments.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    className="border-space-secondary hover:bg-space-secondary/30"
                  >
                    <TableCell className="font-medium text-space-text-primary">
                      {shipment.id}
                    </TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          shipment.status === "Delivered"
                            ? "bg-emerald-100/10 text-emerald-500"
                            : shipment.status === "In Transit"
                            ? "bg-blue-100/10 text-blue-500"
                            : shipment.status === "Delayed"
                            ? "bg-red-100/10 text-red-500"
                            : "bg-yellow-100/10 text-yellow-500"
                        }`}
                      >
                        {shipment.status}
                      </span>
                    </TableCell>
                    <TableCell>{shipment.priority}</TableCell>
                    <TableCell>{shipment.pilot}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-space-secondary pt-4">
            <Button
              variant="outline"
              className="border-space-secondary hover:bg-space-secondary/30"
            >
              Visa alla leveranser
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-space-primary border border-space-secondary border-opacity-50 rounded-xl overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="font-orbitron">Toppdestinationer</CardTitle>
            <CardDescription>
              Leveranser per destination denna månad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {destinationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({
                      active,
                      payload,
                    }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-space-primary border border-space-secondary p-2 rounded">
                            <p className="text-sm">{`${payload[0].name}: ${payload[0].value} leveranser`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-4 space-y-2">
              {destinationData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default DashboardOverview;
