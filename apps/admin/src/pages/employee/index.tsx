import { useState, useRef } from "react";
import { Button, message, Modal, Tag, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Employee,
  getEmployeeList,
  deleteEmployee,
  updateEmployeeStatus,
} from "./service";
import EmployeeForm from "./components/EmployeeForm";

export default function EmployeePage() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<
    Employee | undefined
  >();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Employee>[] = [
    {
      title: "工号",
      dataIndex: "employeeNo",
      width: 120,
      copyable: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "部门",
      dataIndex: "department",
      width: 120,
      hideInSearch: false,
    },
    {
      title: "职位",
      dataIndex: "position",
      width: 120,
      search: false,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 120,
      search: false,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 180,
      search: false,
      ellipsis: true,
    },
    {
      title: "入职日期",
      dataIndex: "hireDate",
      width: 120,
      search: false,
      valueType: "date",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      valueEnum: {
        1: { text: "在职", status: "Success" },
        2: { text: "离职", status: "Default" },
      },
      render: (_, record) => (
        <Tag color={record.status === 1 ? "green" : "default"}>
          {record.status === 1 ? "在职" : "离职"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      search: false,
      valueType: "dateTime",
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      fixed: "right",
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>,
      ],
    },
  ];

  const handleEdit = (record: Employee) => {
    setCurrentEmployee(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record: Employee) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除员工 "${record.name}" 吗？`,
      onOk: async () => {
        try {
          await deleteEmployee(record.id);
          message.success("删除成功");
          actionRef.current?.reload();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  };

  const handleFormSuccess = () => {
    setCreateModalVisible(false);
    setEditModalVisible(false);
    setCurrentEmployee(undefined);
    actionRef.current?.reload();
  };

  return (
    <div style={{ padding: 24 }}>
      <ProTable<Employee>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const { current, pageSize, keyword, department, status } = params;
          const res = await getEmployeeList({
            page: current,
            pageSize,
            keyword,
            department,
            status,
          });
          return {
            data: res.list,
            success: true,
            total: res.total,
          };
        }}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        search={{
          labelWidth: "auto",
        }}
        dateFormatter="string"
        headerTitle="员工列表"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新建员工
          </Button>,
        ]}
        scroll={{ x: 1400 }}
      />

      {/* 新建员工弹窗 */}
      <EmployeeForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleFormSuccess}
      />

      {/* 编辑员工弹窗 */}
      <EmployeeForm
        visible={editModalVisible}
        employee={currentEmployee}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentEmployee(undefined);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
