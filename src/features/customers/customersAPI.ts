import api from "../../services/api";
import type {
  CreateSampleCustomerRequest,
  UpdateSampleCustomerRequest,
  CustomerQueryParams,
} from "../../types";

export const customersAPI = {
  getAll: (params?: CustomerQueryParams) =>
    api.get("/api/SampleCustomers", { params }),

  getById: (id: number) => api.get(`/api/SampleCustomers/${id}`),

  create: (customer: CreateSampleCustomerRequest) =>
    api.post("/api/SampleCustomers", customer),

  update: (id: number, customer: UpdateSampleCustomerRequest) =>
    api.put(`/api/SampleCustomers/${id}`, customer),

  getListForAccounting: (country?: string) =>
    api.get("/api/SampleCustomers/list-for-accounting", {
      params: { Country: country },
    }),
};
