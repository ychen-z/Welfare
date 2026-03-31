import { useEffect } from "react";
import { Modal, Form, Input, DatePicker, message, Select } from "antd";
import { Employee, createEmployee, updateEmployee } from "../service";
import dayjs from "dayjs";

interface EmployeeFormProps {
  visible: boolean;
  employee?: Employee;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EmployeeForm({
  visible,
  employee,
  onCancel,
  onSuccess,
}: EmployeeFormProps) {
  const [form] = Form.useForm();
  const isEdit = !!employee;

  useEffect(() => {
    if (visible) {
      if (employee) {
        form.setFieldsValue({
          ...employee,
          hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, employee, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        hireDate: values.hireDate
          ? values.hireDate.format("YYYY-MM-DD")
          : undefined,
      };

      if (isEdit) {
        await updateEmployee(employee.id, data);
        message.success("更新成功");
      } else {
        await createEmployee(data);
        message.success("创建成功");
      }
      onSuccess();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑员工" : "新建员工"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="employeeNo"
          label="工号"
          rules={[
            { required: true, message: "请输入工号" },
            { max: 50, message: "工号不能超过50个字符" },
          ]}
        >
          <Input placeholder="请输入工号" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: "请输入姓名" },
            { max: 50, message: "姓名不能超过50个字符" },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          name="department"
          label="部门"
          rules={[{ max: 100, message: "部门不能超过100个字符" }]}
        >
          <Input placeholder="请输入部门" />
        </Form.Item>

        <Form.Item
          name="position"
          label="职位"
          rules={[{ max: 100, message: "职位不能超过100个字符" }]}
        >
          <Input placeholder="请输入职位" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ type: "email", message: "请输入正确的邮箱地址" }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item name="hireDate" label="入职日期">
          <DatePicker style={{ width: "100%" }} placeholder="请选择入职日期" />
        </Form.Item>

        {isEdit && (
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value={1}>在职</Select.Option>
              <Select.Option value={2}>离职</Select.Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
