import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentsService } from "@/services/api/studentsService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await studentsService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentsService.delete(student.Id);
        setStudents(prev => prev.filter(s => s.Id !== student.Id));
        toast.success("Student deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete student");
      }
    }
  };

  const handleSaveStudent = (savedStudent) => {
    if (selectedStudent) {
      setStudents(prev => prev.map(s => s.Id === savedStudent.Id ? savedStudent : s));
    } else {
      setStudents(prev => [...prev, savedStudent]);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["First Name", "Last Name", "Email", "Grade", "Student ID", "Enrollment Date", "Status"],
      ...filteredStudents.map(student => [
        student.firstName,
        student.lastName,
        student.email,
        student.grade,
        student.studentId,
        student.enrollmentDate,
        student.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Student data exported successfully!");
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600 mt-1">
            Manage student profiles and information
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
          >
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddStudent}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search students..."
          className="sm:max-w-xs"
        />
        <div className="text-sm text-gray-600">
          {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        searchQuery ? (
          <Empty
            title="No students found"
            description={`No students match "${searchQuery}". Try adjusting your search.`}
            icon="Search"
          />
        ) : (
          <Empty
            title="No students yet"
            description="Get started by adding your first student to the system."
            actionLabel="Add Student"
            onAction={handleAddStudent}
            icon="Users"
          />
        )
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default Students;