import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentsService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getByClassId(classId) {
    await delay(250);
    return assignments.filter(a => a.classId === parseInt(classId));
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error(`Assignment with ID ${id} not found`);
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(350);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`);
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`);
    }
    const deletedAssignment = assignments.splice(index, 1)[0];
    return { ...deletedAssignment };
  }
};