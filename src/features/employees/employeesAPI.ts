import api from '../../services/api';
import type { Employee, EmployeeCreateDto, EmployeeUpdateDto } from './employeesSlice';

export const employeesAPI = {
  getAll: () => api.get<Employee[]>('/api/SampleEmployees'),
  
  getById: (id: number) => api.get<Employee>(`/api/SampleEmployees/${id}`),
  
  create: (employee: EmployeeCreateDto) => api.post<Employee>('/api/SampleEmployees', employee),
  
  update: (id: number, employee: EmployeeUpdateDto) => 
    api.put<Employee>(`/api/SampleEmployees/${id}`, employee),
  
  delete: (id: number) => api.delete(`/api/SampleEmployees/${id}`),
};