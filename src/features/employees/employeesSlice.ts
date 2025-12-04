import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { employeesAPI } from "./employeesAPI";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
}

export interface EmployeeCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
}

export interface EmployeeUpdateDto extends EmployeeCreateDto {
  id: number;
}

interface EmployeesState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await employeesAPI.getAll();
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.value && Array.isArray(data.value)) return data.value;
    return [];
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (id: number) => {
    const response = await employeesAPI.getById(id);
    return response.data;
  }
);

export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employee: EmployeeCreateDto) => {
    const response = await employeesAPI.create(employee);
    return response.data;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (employee: EmployeeUpdateDto) => {
    const response = await employeesAPI.update(employee.id, employee);
    return response.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id: number) => {
    await employeesAPI.delete(id);
    return id;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          state.employees = action.payload;
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployeeById.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.loading = false;
          state.currentEmployee = action.payload;
        }
      )
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employee";
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.loading = false;
          state.employees.push(action.payload);
        }
      )
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create employee";
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.loading = false;
          const index = state.employees.findIndex(
            (emp) => emp.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
          state.currentEmployee = action.payload;
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update employee";
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.employees = state.employees.filter(
            (emp) => emp.id !== action.payload
          );
        }
      )
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete employee";
      });
  },
});

export const { clearCurrentEmployee, clearError } = employeesSlice.actions;

export const selectEmployees = (state: RootState) => {
  const raw = state.employees.employees;
  return Array.isArray(raw) ? raw : [];
};

export const selectCurrentEmployee = (state: RootState) =>
  state.employees.currentEmployee;
export const selectEmployeesLoading = (state: RootState) =>
  state.employees.loading;
export const selectEmployeesError = (state: RootState) => state.employees.error;

export default employeesSlice.reducer;
