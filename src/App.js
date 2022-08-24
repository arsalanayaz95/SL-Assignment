import { useEffect, useState } from "react";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import "antd/dist/antd.min.css";
import { typeOfStatus } from "./constant/status";
import List from "./components/List/List";
import ListForm from "./components/ListForm/ListForm";
import {
  addChildToTask,
  getCurrentStatus,
  updateTaskById,
} from "./utils/helpers";

function App() {
  const [visible, setVisible] = useState(false);
  const [lastId, setLastId] = useState(4);
  const [data, setData] = useState([
    {
      key: uuidv4(),
      id: 1,
      name: "Start the task",
      status: typeOfStatus.DONE,
      parentId: 0,
      children: null,
      total_dependencies: 0,
      dependencies_done: 0,
      dependencies_complete: 0,
    },
    {
      key: uuidv4(),
      id: 2,
      name: "Implement Circular Dependency Check",
      status: typeOfStatus.IN_PROGRESS,
      parentId: 0,
      children: [
        {
          key: uuidv4(),
          id: 3,
          name: "Add A New Task",
          status: typeOfStatus.DONE,
          parentId: 2,
          children: null,
          total_dependencies: 0,
          dependencies_done: 0,
          dependencies_complete: 0,
        },
        {
          key: uuidv4(),
          id: 4,
          name: "Edit Task Functionality",
          status: typeOfStatus.IN_PROGRESS,
          parentId: 2,
          children: null,
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
  const [flatTree, setFlatTree] = useState([]);
  let flat = new Set();
  let checks = new Set();

  useEffect(() => {
    flat = new Set();
    checks = new Set();
    const keys = data.map((element) => getCheckedTask(element))[0];
    const tree = data.map((element) => flatten(element))[0];
    setFlatTree(Array.from(tree));
    setSelectedRowKeys(Array.from(keys));
  }, [data]);

  function flatten(element) {
    flat.add({
      name: element.name,
      id: element.id,
      parentId: element.parentId,
    });

    if (element.children !== null) {
      for (let i = 0; i < element.children.length; i++) {
        flatten(element.children[i]);
      }
    }
    return flat;
  }

  function getCheckedTask(element) {
    if (element.status === typeOfStatus.DONE) {
      checks.add(element.key);
    }
    if (element.children !== null) {
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
    } else if (element.children !== null) {
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
      id: lastId + 1,
      name,
      status: typeOfStatus.IN_PROGRESS,
      parentId: parent || 0,
      children: null,
      total_dependencies: 0,
      dependencies_done: 0,
      dependencies_complete: 0,
    };
    setLastId(lastId + 1);
    if (!parent) {
      setData([...data, newTask]);
    } else {
      const dataCopy = [...data];
      const updatedCopy = dataCopy.map((element) =>
        addChildToTask(parent, element, newTask)
      );
      setData([...updatedCopy]);
    }
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
        flatTree={flatTree}
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
