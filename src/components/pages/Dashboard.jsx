import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentsService } from "@/services/api/studentsService";
import { gradesService } from "@/services/api/gradesService";
import { attendanceService } from "@/services/api/attendanceService";
import { classesService } from "@/services/api/classesService";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [students, grades, attendance, classes] = await Promise.all([
        studentsService.getAll(),
        gradesService.getAll(),
        attendanceService.getAll(),
        classesService.getAll()
      ]);

      // Calculate average grade
      const averageGrade = grades.length > 0 
        ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
        : 0;

      // Calculate attendance rate
      const presentCount = attendance.filter(record => record.status === "Present").length;
      const attendanceRate = attendance.length > 0 
        ? Math.round((presentCount / attendance.length) * 100)
        : 0;

      // Calculate recent activity (grades added in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentGrades = grades.filter(grade => 
        new Date(grade.submittedDate) >= weekAgo
      ).length;

      setStats({
        totalStudents: students.length,
        averageGrade,
        attendanceRate,
        totalClasses: classes.length,
        recentActivity: recentGrades
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Welcome to ScholarHub
        </h2>
        <p className="text-gray-600">
          Here's an overview of your classroom management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
        />
        
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BookOpen"
          color="success"
        />
        
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="secondary"
        />
        
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          icon="School"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stats.recentActivity} new grades added this week
                </p>
                <p className="text-xs text-gray-500">Keep up the great work!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  All classes are up to date
                </p>
                <p className="text-xs text-gray-500">No pending attendance records</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium text-gray-900">Mark Attendance</div>
              <div className="text-xs text-gray-500">Today's records</div>
            </button>
            <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium text-gray-900">Enter Grades</div>
              <div className="text-xs text-gray-500">Recent assignments</div>
            </button>
            <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium text-gray-900">Add Student</div>
              <div className="text-xs text-gray-500">New enrollment</div>
            </button>
            <button className="p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium text-gray-900">Generate Report</div>
              <div className="text-xs text-gray-500">Class summary</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;