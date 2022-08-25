import { v4 as uuidv4 } from "uuid";
import { typeOfStatus } from "../constant/status";

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

export function updateParent(parentId, data, status) {
  if (data.id === parentId && data.status === typeOfStatus.DONE) {
    const children = data.children.length;
    const completed = data.children.filter(
      (child) => child.status === typeOfStatus.COMPLETE
    ).length;
    if (children === completed) {
      data["status"] = typeOfStatus.COMPLETE;
      data["key"] = uuidv4();
    }
  } else if (
    data.id === parentId &&
    data.status === typeOfStatus.COMPLETE &&
    status === typeOfStatus.DONE
  ) {
    data["status"] = typeOfStatus.DONE;
    data["key"] = uuidv4();
  }
  if (data.children !== null && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = updateParent(parentId, data.children[i]);
    }
  }
  return data;
}

export function addChildToTask(parentId, data, task) {
  if (data.id === parentId) {
    if (data.children === null) {
      data.children = [task];
      data["key"] = uuidv4();
    } else {
      data.children.push(task);
    }
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
