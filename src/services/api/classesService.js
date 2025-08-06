import { toast } from "react-toastify";

const tableName = 'class';

const tableFields = [
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Name" } },
  { "field": { "Name": "subject" } },
  { "field": { "Name": "period" } },
  { "field": { "Name": "studentIds" } }
];

export const classesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: tableFields,
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response || !response.data || response.data.length === 0) {
        return [];
      }

      // Parse studentIds from comma-separated string to array for UI compatibility
      const processedData = response.data.map(classItem => ({
        ...classItem,
        name: classItem.Name, // Map Name to name for UI compatibility
        studentIds: classItem.studentIds ? 
          classItem.studentIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : 
          []
      }));

      return processedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { fields: tableFields };
      const response = await apperClient.getRecordById(tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      // Parse studentIds from comma-separated string to array for UI compatibility
      const processedData = {
        ...response.data,
        name: response.data.Name, // Map Name to name for UI compatibility
        studentIds: response.data.studentIds ? 
          response.data.studentIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : 
          []
      };

      return processedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Tags: "",
        Name: classData.Name || classData.name,
        subject: classData.subject,
        period: classData.period,
        studentIds: Array.isArray(classData.studentIds) ? 
          classData.studentIds.join(',') : 
          (classData.studentIds || "")
      };

      const params = { records: [updateableData] };
      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create classes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const result = successfulRecords[0].data;
          // Process the response to match UI expectations
          return {
            ...result,
            name: result.Name,
            studentIds: result.studentIds ? 
              result.studentIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : 
              []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating class records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        Tags: classData.Tags || "",
        Name: classData.Name || classData.name,
        subject: classData.subject,
        period: classData.period,
        studentIds: Array.isArray(classData.studentIds) ? 
          classData.studentIds.join(',') : 
          (classData.studentIds || "")
      };

      const params = { records: [updateableData] };
      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update classes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const result = successfulUpdates[0].data;
          // Process the response to match UI expectations
          return {
            ...result,
            name: result.Name,
            studentIds: result.studentIds ? 
              result.studentIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : 
              []
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating class records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete classes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};