import { Table } from "antd";
import { useState } from "react";
import { ListAttributes } from "../../constant/listAttributes";
import { typeOfStatus } from "../../constant/status";
import "./List.css";

export default function List({ updateTaskList, data }) {
const [selectedRowKeys, setSelectedRowKeys] = useState(data?.filter(value => value.status === typeOfStatus.DONE).map(item => item.key));
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
          text: typeOfStatus.COMPLETE,
          value: typeOfStatus.COMPLETE,
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    { title: "Total Sub-Tasks", dataIndex: "total_dependencies", key: "total_dependencies",  },
    { title: "Sub-Tasks Done", dataIndex: "dependencies_done", key: "dependencies_done", },
    { title: "Sub-Tasks Completed", dataIndex: "dependencies_complete", key: "dependencies_complete", },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      render: () => (
        <span>EDIT | DELETE</span>
      ),
    },
  ];
  return (
    <div>
      <Table
        className="components-table-demo-nested"
        rowSelection={{
          selectedRowKeys,
          type:  ListAttributes.rowSelectionType,
          hideSelectAll: true,
          onSelect: (record, _, selectedRows) => {
            updateTaskList(record);
            setSelectedRowKeys(selectedRows.map(row => row.key));
          }
        }}
        columns={columns}
        indentSize = {30}
        dataSource={[...data]}
        pagination={{ pageSize:  ListAttributes.pageSize, position: ListAttributes.paginationPosition }}
      />
    </div>
  );
}
