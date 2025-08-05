import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import { classesService } from "@/services/api/classesService";
import { studentsService } from "@/services/api/studentsService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [classesData, studentsData] = await Promise.all([
        classesService.getAll(),
        studentsService.getAll()
      ]);

      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load classes data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getClassStudents = (classItem) => {
    return students.filter(student => classItem.studentIds.includes(student.Id));
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Mathematics": "primary",
      "Science": "success",
      "English": "secondary",
      "History": "warning",
      "Physics": "info"
    };
    return colors[subject] || "default";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Classes</h2>
          <p className="text-gray-600 mt-1">
            Manage your class rosters and schedules
          </p>
        </div>
        <Button>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Empty
          title="No classes yet"
          description="Get started by creating your first class."
          actionLabel="Add Class"
          icon="School"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(classItem => {
            const classStudents = getClassStudents(classItem);
            return (
              <Card key={classItem.Id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{classItem.period}</p>
                    </div>
                    <Badge variant={getSubjectColor(classItem.subject)}>
                      {classItem.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Users" className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {classStudents.length} Students
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Clock" className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{classItem.period}</span>
                      </div>
                    </div>

                    {classStudents.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Students:</p>
                        <div className="flex flex-wrap gap-2">
                          {classStudents.slice(0, 3).map(student => (
                            <div key={student.Id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {student.firstName.charAt(0)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-700">
                                {student.firstName}
                              </span>
                            </div>
                          ))}
                          {classStudents.length > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs text-gray-600">
                              +{classStudents.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ApperIcon name="School" className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classes.reduce((total, classItem) => total + classItem.studentIds.length, 0)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <ApperIcon name="Users" className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Class Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classes.length > 0 
                      ? Math.round(classes.reduce((total, classItem) => total + classItem.studentIds.length, 0) / classes.length)
                      : 0
                    }
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ApperIcon name="BarChart3" className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Classes;