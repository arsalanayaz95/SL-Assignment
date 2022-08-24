import { useEffect, useState } from "react";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import "antd/dist/antd.min.css";
import { typeOfStatus } from "./constant/status";
import List from "./components/List/List";
import ListForm from "./components/ListForm/ListForm";
import { getCurrentStatus, updateTaskById } from "./utils/helpers";

function App() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([
    {
      key: uuidv4(),
      id: 1,
      name: "Start the task",
      description: "Start Working On This Task Thingy",
      status: typeOfStatus.DONE,
      parentId: 0,
      total_dependencies: 0,
      dependencies_done: 0,
      dependencies_complete: 0,
    },
    {
      key: uuidv4(),
      id: 2,
      name: "Implement Circular Dependency Check",
      description:
        "While adding a new task and selecting parentId, check for dependency loop",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 0,
      children: [
        {
          key: uuidv4(),
          id: 3,
          name: "Add A New Task",
          description: "Develop a popup form to add a new task to the list",
          status: typeOfStatus.DONE,
          parentId: 2,
          total_dependencies: 0,
          dependencies_done: 0,
          dependencies_complete: 0,
        },
        {
          key: uuidv4(),
          id: 4,
          name: "Edit Task Functionality",
          description: "Edit a task in-line and then save or cancel",
          status: typeOfStatus.IN_PROGRESS,
          parentId: 2,
          total_dependencies: 0,
          dependencies_done: 0,
          dependencies_complete: 0,
        },
      ],
      total_dependencies: 0,
      dependencies_done: 0,
      dependencies_complete: 0,
    },
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const keys = data.map((element) => getCheckedTask(element))[0];
    setSelectedRowKeys(Array.from(keys));
  }, []);

  let checks = new Set();
  function getCheckedTask(element) {
    if (element.status === typeOfStatus.DONE) {
      checks.add(element.key);
    }
    if (element.children !== undefined) {
      for (let i = 0; i < element.children.length; i++) {
        getCheckedTask(element.children[i]);
      }
    }
    return checks;
  }

  let count = 0;
  function searchTaskList(element, matchingId, status = null) {
    if (status) {
      if (element.parentId === matchingId && element.status === status) {
        count++;
      }
    } else if (element.parentId === matchingId) {
      count++;
    } else if (element.children !== undefined) {
      let result = null;
      for (let i = 0; result === null && i < element.children.length; i++) {
        result = searchTaskList(element.children[i], matchingId, status);
      }
      return count;
    }
    return null;
  }

  const updateTaskList = (record) => {
    const dataCopy = [...data];
    const updatedCopy = dataCopy.map((element) => {
      count = 0;
      const dependencies = searchTaskList(element, record.id);
      const dependenciesComplete = searchTaskList(
        element,
        record.id,
        typeOfStatus.COMPLETE
      );
      const currentStatus = getCurrentStatus(element, record.id);
      switch (currentStatus) {
        case typeOfStatus.IN_PROGRESS:
          if (dependencies === 0 || dependenciesComplete === dependencies) {
            updateTaskById(record.id, element, "status", typeOfStatus.COMPLETE);
          } else {
            updateTaskById(record.id, element, "status", typeOfStatus.DONE);
          }
          break;
        case typeOfStatus.COMPLETE:
        case typeOfStatus.DONE:
          updateTaskById(
            record.id,
            element,
            "status",
            typeOfStatus.IN_PROGRESS
          );
          break;

        default:
          break;
      }
      return element;
    });
    setData([...updatedCopy]);
  };

  const onCreate = ({ name, parent }) => {
    const newTask = {
      key: uuidv4(),
      id: data.length + 1,
      name,
      description: name,
      status: typeOfStatus.IN_PROGRESS,
      parentId: parent || 0,
      total_dependencies: 0,
      dependencies_done: 0,
      dependencies_complete: 0,
    };
    setData([...data, newTask]);
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
      <ListForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <List
        updateTaskList={updateTaskList}
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </div>
  );
}
export default App;
