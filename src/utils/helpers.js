import { v4 as uuidv4 } from "uuid";

export function updateTaskById(id, data, property, value) {
  if (data.id === id) {
    data[property] = value;
    data["key"] = uuidv4();
  }
  if (data.children !== undefined && data.children.length > 0) {
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = updateTaskById(id, data.children[i], property, value);
    }
  }
  return data;
}

export function getCurrentStatus(element, matchingId) {
  if (element.id === matchingId) {
    return element.status;
  } else if (element.children !== undefined) {
    let result = null;
    for (let i = 0; result === null && i < element.children.length; i++) {
      result = getCurrentStatus(element.children[i], matchingId);
    }
    return result;
  }
  return null;
}
