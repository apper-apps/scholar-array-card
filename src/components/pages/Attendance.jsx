import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, startOfWeek, addDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatusBadge from "@/components/molecules/StatusBadge";
import { attendanceService } from "@/services/api/attendanceService";
import { studentsService } from "@/services/api/studentsService";
import { classesService } from "@/services/api/classesService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [attendanceData, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentsService.getAll(),
        classesService.getAll()
      ]);

      setAttendance(attendanceData);
      setStudents(studentsData);
      setClasses(classesData);

      if (classesData.length > 0) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCurrentClassStudents = () => {
    if (!selectedClass) return [];
    const classData = classes.find(c => c.Id.toString() === selectedClass);
    if (!classData) return [];
    return students.filter(student => classData.studentIds.includes(student.Id));
  };

  const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(a => 
      a.studentId === studentId && 
      a.date === date && 
      a.classId.toString() === selectedClass
    );
    return record ? record.status : null;
  };

  const handleAttendanceChange = async (studentId, status) => {
    try {
      const existingRecord = attendance.find(a => 
        a.studentId === studentId && 
        a.date === selectedDate && 
        a.classId.toString() === selectedClass
      );

      if (existingRecord) {
        const updatedRecord = await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status
        });
        setAttendance(prev => prev.map(a => 
          a.Id === updatedRecord.Id ? updatedRecord : a
        ));
      } else {
        const newRecord = await attendanceService.create({
          studentId: parseInt(studentId),
          classId: parseInt(selectedClass),
          date: selectedDate,
          status
        });
        setAttendance(prev => [...prev, newRecord]);
      }
      
      toast.success("Attendance updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update attendance");
    }
  };

  const calculateAttendanceRate = (studentId) => {
    const studentRecords = attendance.filter(a => 
      a.studentId === studentId && a.classId.toString() === selectedClass
    );
    if (studentRecords.length === 0) return 0;
    
    const presentCount = studentRecords.filter(a => a.status === "Present").length;
    return Math.round((presentCount / studentRecords.length) * 100);
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date(selectedDate));
    return Array.from({ length: 5 }, (_, i) => addDays(start, i + 1)); // Monday to Friday
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const currentStudents = getCurrentClassStudents();
  const weekDays = getWeekDays();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle>Daily Attendance</CardTitle>
              <div className="flex space-x-4">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {classes.map(classItem => (
                    <option key={classItem.Id} value={classItem.Id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentStudents.length === 0 ? (
              <Empty
                title="No students in this class"
                description="Add students to this class to start taking attendance."
                icon="Users"
              />
            ) : (
              <div className="space-y-4">
                {currentStudents.map(student => {
                  const currentStatus = getAttendanceStatus(student.Id, selectedDate);
                  return (
                    <div key={student.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.studentId}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {["Present", "Tardy", "Absent"].map(status => (
                          <Button
                            key={status}
                            size="sm"
                            variant={currentStatus === status ? "default" : "outline"}
                            onClick={() => handleAttendanceChange(student.Id, status)}
                            className={
                              currentStatus === status
                                ? status === "Present"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : status === "Tardy"
                                  ? "bg-yellow-600 hover:bg-yellow-700"
                                  : "bg-red-600 hover:bg-red-700"
                                : ""
                            }
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentStudents.slice(0, 5).map(student => (
                <div key={student.Id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {calculateAttendanceRate(student.Id)}% attendance
                    </div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${calculateAttendanceRate(student.Id)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {currentStudents.length > 5 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  And {currentStudents.length - 5} more students...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {currentStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Student
                    </th>
                    {weekDays.map(day => (
                      <th key={day.toISOString()} className="text-center py-3 px-4 font-medium text-gray-900">
                        <div>
                          <div className="text-sm">{format(day, "EEE")}</div>
                          <div className="text-xs text-gray-500">{format(day, "MM/dd")}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map(student => (
                    <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      {weekDays.map(day => {
                        const dayStr = format(day, "yyyy-MM-dd");
                        const status = getAttendanceStatus(student.Id, dayStr);
                        return (
                          <td key={day.toISOString()} className="py-3 px-4 text-center">
                            {status ? (
                              <StatusBadge status={status} type="attendance" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Attendance;