import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { studentsService } from "@/services/api/studentsService";

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    studentId: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        grade: student.grade || "",
        studentId: student.studentId || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        grade: "",
        studentId: ""
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.grade.trim()) newErrors.grade = "Grade is required";
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedStudent;
      if (student) {
        savedStudent = await studentsService.update(student.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        savedStudent = await studentsService.create(formData);
        toast.success("Student created successfully!");
      }
      onSave(savedStudent);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
            placeholder="Enter last name"
          />

          <FormField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter email address"
          />

          <FormField
            label="Grade"
            required
            value={formData.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            error={errors.grade}
            placeholder="Enter grade level"
          />

          <FormField
            label="Student ID"
            required
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            error={errors.studentId}
            placeholder="Enter student ID"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {student ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;