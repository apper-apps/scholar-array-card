import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StatusBadge from "@/components/molecules/StatusBadge";
import { gradesService } from "@/services/api/gradesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { studentsService } from "@/services/api/studentsService";
import { classesService } from "@/services/api/classesService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gradeData, setGradeData] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [gradesData, assignmentsData, studentsData, classesData] = await Promise.all([
        gradesService.getAll(),
        assignmentsService.getAll(),
        studentsService.getAll(),
        classesService.getAll()
      ]);

      setGrades(gradesData);
      setAssignments(assignmentsData);
      setStudents(studentsData);
      setClasses(classesData);

      if (classesData.length > 0) {
        setSelectedClass(classesData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Create grade data matrix
    const data = {};
    students.forEach(student => {
      data[student.Id] = {};
      assignments.forEach(assignment => {
        const grade = grades.find(g => 
          g.studentId === student.Id && g.assignmentId === assignment.Id
        );
        data[student.Id][assignment.Id] = grade ? grade.score : null;
      });
    });
    setGradeData(data);
  }, [grades, assignments, students]);

  const getCurrentClassStudents = () => {
    if (!selectedClass) return [];
    const classData = classes.find(c => c.Id.toString() === selectedClass);
    if (!classData) return [];
    return students.filter(student => classData.studentIds.includes(student.Id));
  };

  const getCurrentClassAssignments = () => {
    if (!selectedClass) return [];
    return assignments.filter(assignment => 
      assignment.classId.toString() === selectedClass
    );
  };

  const handleGradeChange = async (studentId, assignmentId, newScore) => {
    try {
      const existingGrade = grades.find(g => 
        g.studentId === studentId && g.assignmentId === assignmentId
      );

      if (existingGrade) {
        const updatedGrade = await gradesService.update(existingGrade.Id, {
          ...existingGrade,
          score: parseFloat(newScore)
        });
        setGrades(prev => prev.map(g => 
          g.Id === updatedGrade.Id ? updatedGrade : g
        ));
      } else {
        const newGrade = await gradesService.create({
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId),
          score: parseFloat(newScore)
        });
        setGrades(prev => [...prev, newGrade]);
      }
      
      toast.success("Grade saved successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save grade");
    }
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return null;
    const average = studentGrades.reduce((sum, grade) => sum + grade.score, 0) / studentGrades.length;
    return Math.round(average);
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const currentStudents = getCurrentClassStudents();
  const currentAssignments = getCurrentClassAssignments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grades</h2>
          <p className="text-gray-600 mt-1">
            Manage student grades and assignments
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Grade Book</CardTitle>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStudents.length === 0 ? (
            <Empty
              title="No students in this class"
              description="Add students to this class to start entering grades."
              icon="Users"
            />
          ) : currentAssignments.length === 0 ? (
            <Empty
              title="No assignments yet"
              description="Create assignments for this class to start grading."
              icon="BookOpen"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Student
                    </th>
                    {currentAssignments.map(assignment => (
                      <th key={assignment.Id} className="text-center py-3 px-4 font-medium text-gray-900 min-w-[120px]">
                        <div>
                          <div className="text-sm">{assignment.name}</div>
                          <div className="text-xs text-gray-500">{assignment.totalPoints} pts</div>
                        </div>
                      </th>
                    ))}
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Average
                    </th>
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
                      {currentAssignments.map(assignment => (
                        <td key={assignment.Id} className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={assignment.totalPoints}
                            value={gradeData[student.Id]?.[assignment.Id] || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value !== "") {
                                handleGradeChange(student.Id, assignment.Id, value);
                              }
                            }}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="-"
                          />
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center">
                        {(() => {
                          const avg = calculateStudentAverage(student.Id);
                          return avg !== null ? (
                            <StatusBadge status={avg} type="grade" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {currentStudents.length > 0 && currentAssignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Average</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const allGrades = grades.filter(g => 
                        currentAssignments.some(a => a.Id === g.assignmentId)
                      );
                      const avg = allGrades.length > 0 
                        ? Math.round(allGrades.reduce((sum, g) => sum + g.score, 0) / allGrades.length)
                        : 0;
                      return `${avg}%`;
                    })()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{currentAssignments.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <ApperIcon name="BookOpen" className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Graded</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const totalPossible = currentStudents.length * currentAssignments.length;
                      const graded = grades.filter(g => 
                        currentAssignments.some(a => a.Id === g.assignmentId) &&
                        currentStudents.some(s => s.Id === g.studentId)
                      ).length;
                      const percentage = totalPossible > 0 ? Math.round((graded / totalPossible) * 100) : 0;
                      return `${percentage}%`;
                    })()}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ApperIcon name="CheckCircle" className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Grades;