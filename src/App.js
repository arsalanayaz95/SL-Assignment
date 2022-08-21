import { useState } from "react";
import { Table, Dropdown, Button, Form, Input, Modal, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import "antd/dist/antd.min.css";
import { typeOfStatus } from "./constant/status";

function App() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([
    {
      key: 1,
      id: 1,
      name: "Start the task",
      description: "Start Working On This Task Thingy",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 0,
    },
    {
      key: 2,
      id: 2,
      name: "Implement Circular Dependency Check",
      description:
        "While adding a new task and selecting parentId, check for dependency loop",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 0,
    },
    {
      key: 3,
      id: 3,
      name: "Add A New Task",
      description: "Develop a popup form to add a new task to the list",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 2,
    },
    {
      key: 4,
      id: 4,
      name: "Edit Task Functionality",
      description: "Edit a task in-line and then save or cancel",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 3,
    },
  ]);

  const updateTaskList = (id) => {
    const selectedTaskIndex = data.findIndex((_data) => _data.id === id);
    const dataCopy = [...data];
    if (dataCopy[selectedTaskIndex].status === typeOfStatus.IN_PROGRESS) {
      dataCopy[selectedTaskIndex].status = typeOfStatus.DONE;
      dataCopy[selectedTaskIndex].key = uuidv4();
      setData(dataCopy);
    } else {
      dataCopy[selectedTaskIndex].status = typeOfStatus.IN_PROGRESS;
      dataCopy[selectedTaskIndex].key = uuidv4();
      setData(dataCopy);
    }
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
  };
  return (
    <div className="App">
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        Add New Task
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <NestedTable updateTaskList={updateTaskList} data={data} />
    </div>
  );
}

function NestedTable({ updateTaskList, data }) {
  const expandedRowRender = () => {
    const columns = [
      { title: "Task ID", dataIndex: "id", key: "id" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Description", dataIndex: "description", key: "description" },
      { title: "Status", dataIndex: "status", key: "status" },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <span className="table-operation">
            <Dropdown>
              <span>Edit | Delete</span>
            </Dropdown>
          </span>
        ),
      },
    ];
    return (
      <Table
        rowSelection={{
          type: "checkbox",
          hideSelectAll: true,
          onSelect: (record) => {
            updateTaskList(record.id);
          },
        }}
        columns={columns}
        dataSource={[...data]}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "Task ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: typeOfStatus.IN_PROGRESS,
          value: typeOfStatus.IN_PROGRESS,
        },
        {
          text: typeOfStatus.DONE,
          value: typeOfStatus.DONE,
        },
        {
          text: "Complete",
          value: "Complete",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: () => (
        <span className="table-operation">
          <Dropdown>
            <span>EDIT | DELETE</span>
          </Dropdown>
        </span>
      ),
    },
  ];
  return (
    <div>
      <Table
        className="components-table-demo-nested"
        rowSelection={{
          type: "checkbox",
          hideSelectAll: true,
          onSelect: (record) => {
            updateTaskList(record.id);
          },
        }}
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={[...data]}
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
      />
    </div>
  );
}

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
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
};
export default App;
