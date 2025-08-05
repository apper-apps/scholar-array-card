import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentsService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(350);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(250);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    const deletedStudent = students.splice(index, 1)[0];
    return { ...deletedStudent };
  }
};