import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getByStudentId(studentId) {
    await delay(250);
    return attendance.filter(a => a.studentId === parseInt(studentId));
  },

  async getByClassId(classId) {
    await delay(250);
    return attendance.filter(a => a.classId === parseInt(classId));
  },

  async getByDate(date) {
    await delay(250);
    return attendance.filter(a => a.date === date);
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    return { ...record };
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(350);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(250);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
};