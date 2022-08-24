import { v4 as uuidv4 } from "uuid";

export function updateTaskById(id, data, property, value) {
  if (data.id === id) {
    data[property] = value;
    data["key"] = uuidv4();
  }
  if (data.children !== null && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = updateTaskById(id, data.children[i], property, value);
    }
  }
  return data;
}

export function addChildToTask(parentId, data, task) {
  if (data.id === parentId && data.children === null) {
    data.children = [task];
    data["key"] = uuidv4();
  }
  if (data.children !== null && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = addChildToTask(parentId, data.children[i], task);
    }
  }
  return data;
}

export function getCurrentStatus(element, matchingId) {
  if (element.id === matchingId) {
    return element.status;
  } else if (element.children !== null) {
    let result = null;
    for (let i = 0; result === null && i < element.children.length; i++) {
      result = getCurrentStatus(element.children[i], matchingId);
    }
    return result;
  }
  return null;
}
