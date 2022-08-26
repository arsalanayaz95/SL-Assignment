import { Form, Input, Modal, Select } from "antd";

export default function ListForm({ visible, onCreate, onCancel, flatTree }) {
  const { Option } = Select;
  const [form] = Form.useForm();
  const sortedTasks = flatTree.sort((a,b) => (a.task_id > b.task_id) ? 1 : ((b.task_id > a.task_id) ? -1 : 0));
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
            console.log("Validation Failed:", info);
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
          <Select placeholder="Select Your Parent Task (optional)">
            {sortedTasks.map( (node) => <Option key={node.task_id} value={node.task_id}>{node.task_id} - {node.name}</Option> )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
