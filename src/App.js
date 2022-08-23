import { useState } from "react";
import { Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import "antd/dist/antd.min.css";
import { typeOfStatus } from "./constant/status";
import List from "./components/List/List";
import ListForm from "./components/ListForm/ListForm";

function App() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([
    {
      key: uuidv4(),
      id: 1,
      name: "Start the task",
      description: "Start Working On This Task Thingy",
      status: typeOfStatus.IN_PROGRESS,
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
          children: [
            {
              key: uuidv4(),
              id: 4,
              name: "Edit Task Functionality",
              description: "Edit a task in-line and then save or cancel",
              status: typeOfStatus.IN_PROGRESS,
              parentId: 3,
              total_dependencies: 0,
              dependencies_done: 0,
              dependencies_complete: 0,
            },
          ],
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

  // useEffect(() => {
  //   const dataCopy = [...data];
  //   dataCopy.forEach((record) => {
  //     const selectedTaskIndex = data.findIndex(
  //       (_data) => _data.id === record.id
  //     );
  //     const dependencies = dataCopy.filter(
  //       (_data) => _data.parentId === record.id
  //     ).length;
  //     dataCopy[selectedTaskIndex].total_dependencies = dependencies;
  //   });
  //   setData([...dataCopy]);
  //   // const dependenciesComplete = dataCopy.filter(
  //   //   (_data) =>
  //   //     _data.status === typeOfStatus.COMPLETE && _data.parentId === record.id
  //   // ).length;
  // }, []);

  const updateTaskList = (record) => {
    const selectedTaskIndex = data.findIndex((_data) => _data.id === record.id);
    const updatedData = getUpdatedData(record, selectedTaskIndex);
    updatedData[selectedTaskIndex].key = uuidv4();
    setData([...updatedData]);
  };

  const getUpdatedData = (record, selectedTaskIndex) => {
    const dataCopy = [...data];
    const dependencies = dataCopy.filter(
      (_data) => _data.parentId === record.id
    ).length;
    const dependenciesComplete = dataCopy.filter(
      (_data) =>
        _data.status === typeOfStatus.COMPLETE && _data.parentId === record.id
    ).length;
    if (dataCopy[selectedTaskIndex].status === typeOfStatus.IN_PROGRESS) {
      //PERFORM ACTION ON PARENTS
      if (dependencies === 0 || dependenciesComplete === dependencies) {
        dataCopy[selectedTaskIndex].status = typeOfStatus.COMPLETE;
      } else {
        dataCopy[selectedTaskIndex].status = typeOfStatus.DONE;
      }
    } else if (dataCopy[selectedTaskIndex].status === typeOfStatus.COMPLETE) {
      dataCopy[selectedTaskIndex].status = typeOfStatus.IN_PROGRESS;
    } else if (dataCopy[selectedTaskIndex].status === typeOfStatus.DONE) {
      //PERFORM ACTION ON PARENTS
      dataCopy[selectedTaskIndex].status = typeOfStatus.IN_PROGRESS;
    }
    return dataCopy;
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
      <List updateTaskList={updateTaskList} data={data} />
    </div>
  );
}
export default App;
