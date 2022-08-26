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
  const [lastId, setLastId] = useState(0);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [flatTree, setFlatTree] = useState([]);
  let flat = new Set();
  let checks = new Set();

  useEffect(() => {
    if (data.length > 0) {
      const {keys, tree} = data.map((element) => {
        return{
          keys: getCheckedTask(element),
          tree: flatten(element)
        }  
      })[0];
      setFlatTree(Array.from(tree));
      setSelectedRowKeys(Array.from(keys));
    }
    // eslint-disable-next-line
  }, [data]);

  function flatten(element) {
    flat.add({
      name: element.name,
      task_id: element.task_id,
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
    if (
      element.status === typeOfStatus.DONE ||
      element.status === typeOfStatus.COMPLETE
    ) {
      checks.add(element.key);
    }
    if (element.children !== null) {
      for (let i = 0; i < element.children.length; i++) {
        getCheckedTask(element.children[i]);
      }
    }
    return checks;
  }

  let countDependency = 0;
  let countCompletedDependency = 0;
  function searchTaskList(element, matchingId) {
    if (
      element.parentId === matchingId &&
      element.status === typeOfStatus.COMPLETE
    ) {
      countCompletedDependency++;
      countDependency++;
    } else if (element.parentId === matchingId) {
      countDependency++;
    } else if (element.children !== null) {
      let result = null;
      for (let i = 0; result === null && i < element.children.length; i++) {
        result = searchTaskList(element.children[i], matchingId);
      }
    }
    return null;
  }

  const updateTaskList = (record) => {
    const dataCopy = [...data];
    const updatedCopy = dataCopy.map((element) => {
      countDependency = 0;
      countCompletedDependency = 0;
      searchTaskList(element, record.task_id);
      const currentStatus = getCurrentStatus(element, record.task_id);
      let statusParam = typeOfStatus.DONE;
      const parentStatusParam = typeOfStatus.DONE;
      let callParent = 1;
      switch (currentStatus) {
        case typeOfStatus.IN_PROGRESS:
          if (
            countDependency === 0 ||
            countCompletedDependency === countDependency
          ) {
            statusParam = typeOfStatus.COMPLETE;
          } else {
            callParent = 0;
            statusParam = typeOfStatus.DONE;
          }
          break;
        case typeOfStatus.COMPLETE:
          if (record.children !== null) {
            statusParam = typeOfStatus.DONE;
          }else{
            statusParam = typeOfStatus.IN_PROGRESS;
          }
          break;
        default:
          break;
      }
       updateTaskById(record.task_id, element, "status", statusParam);
       if(callParent) updateParent(record.parentId, element, parentStatusParam);
      return element;
    });
    setData([...updatedCopy]);
  };

  function updateParent(parentId, incomingData, status) {
    if (
      incomingData.task_id === parentId &&
      incomingData.status === typeOfStatus.DONE
    ) {
      const children = incomingData.children.length;
      const completed = incomingData.children.filter(
        (child) => child.status === typeOfStatus.COMPLETE
      ).length;
      if (children === completed) {
        incomingData["status"] = typeOfStatus.COMPLETE;
        incomingData["key"] = uuidv4();
        if(incomingData.parentId !== 0) data.forEach(element => updateParent(incomingData.parentId, element, typeOfStatus.COMPLETE));
      }
    } else if (
      incomingData.task_id === parentId &&
      incomingData.status === typeOfStatus.COMPLETE &&
      status === typeOfStatus.DONE
    ) {
      incomingData["status"] = typeOfStatus.DONE;
      incomingData["key"] = uuidv4();
      if (incomingData.parentId !== 0)
        data.forEach((element) =>
          updateParent(incomingData.parentId, element, typeOfStatus.DONE)
        );
    }

    if (incomingData.children !== null && incomingData.children.length > 0) {
      for (let i = 0; i < incomingData.children.length; i++) {
        incomingData.children[i] = updateParent(
          parentId,
          incomingData.children[i],
          status
        );
      }
    }
    return incomingData;
  }

  const onCreate = async ({ name, parent }) => {
    const newTask = {
      key: uuidv4(),
      task_id: lastId + 1,
      name,
      status: typeOfStatus.IN_PROGRESS,
      parentId: parent || 0,
      children: null,
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
