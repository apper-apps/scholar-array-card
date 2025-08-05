import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradesService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getByStudentId(studentId) {
    await delay(250);
    return grades.filter(g => g.studentId === parseInt(studentId));
  },

  async getByAssignmentId(assignmentId) {
    await delay(250);
    return grades.filter(g => g.assignmentId === parseInt(assignmentId));
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    return { ...grade };
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      submittedDate: new Date().toISOString().split("T")[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(350);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(250);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
};