import { request } from "@/utils/request";

export interface Employee {
  id: number;
  employeeNo: string;
  name: string;
  department?: string;
  position?: string;
  phone?: string;
  email?: string;
  hireDate?: string;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface EmployeeListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  department?: string;
  status?: number;
}

export interface EmployeeListResponse {
  list: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取员工列表
export async function getEmployeeList(params: EmployeeListParams) {
  return request<EmployeeListResponse>("/api/employee", {
    method: "GET",
    params,
  });
}

// 获取员工详情
export async function getEmployeeDetail(id: number) {
  return request<Employee>(`/api/employee/${id}`, {
    method: "GET",
  });
}

// 创建员工
export async function createEmployee(data: Partial<Employee>) {
  return request<Employee>("/api/employee", {
    method: "POST",
    data,
  });
}

// 更新员工
export async function updateEmployee(id: number, data: Partial<Employee>) {
  return request<Employee>(`/api/employee/${id}`, {
    method: "PUT",
    data,
  });
}

// 删除员工
export async function deleteEmployee(id: number) {
  return request("/api/employee/${id}", {
    method: "DELETE",
  });
}

// 更新员工状态
export async function updateEmployeeStatus(id: number, status: number) {
  return request<Employee>(`/api/employee/${id}/status`, {
    method: "PATCH",
    data: { status },
  });
}
