import { Form, Input, Modal, Select } from "antd";

export default function ListForm({ visible, onCreate, onCancel }) {
  const { Option } = Select;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Add a New Task"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of the task!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="parent"
          label="Parent Task"
          rules={[{ required: false, message: "Please select parent task!" }]}
        >
          <Select placeholder="select your parent task">
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
