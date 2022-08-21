import { Table } from "antd";
import { useState } from "react";
import { ListAttributes } from "../../constant/listAttributes";
import { typeOfStatus } from "../../constant/status";

export default function List({ updateTaskList, data }) {
//     const expandedRowRender = () => {
//     const nested_columns = [
//       { title: "Task ID", dataIndex: "id", key: "id" },
//       { title: "Name", dataIndex: "name", key: "name" },
//       { title: "Description", dataIndex: "description", key: "description" },
//       { title: "Status", dataIndex: "status", key: "status" },
//       {
//         title: "Action",
//         dataIndex: "operation",
//         key: "operation",
//         render: () => (
//           <span className="table-operation">
//             <Dropdown>
//               <span>Edit | Delete</span>
//             </Dropdown>
//           </span>
//         ),
//       },
//     ];
//     return (
//       <Table
//         rowSelection={{
//           type: ListAttributes.rowSelectionType,
//           hideSelectAll: true,
//           onSelect: (record) => {
//             updateTaskList(record.id);
//           },
//         }}
//         expandable={{
//       expandedRowRender: expandedRowRender2,
//     }}
//         columns={nested_columns}
//         dataSource={[...data]}
//         pagination={false}
//       />
//     );
//   };
  const [selectedRowKeys, setSelectedRowKeys] = useState(data.filter(value => value.status === typeOfStatus.DONE).map(item => item.key));
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
          onChange: (_selectedRowKeys) => {
            console.log("change", _selectedRowKeys)
            setSelectedRowKeys(_selectedRowKeys)
          },
          onSelect: (record) => {
            console.log("select", record)
            updateTaskList(record.id);
          }
        }}
        columns={columns}
        // expandable={{ expandedRowRender }}
        dataSource={[...data]}
        pagination={{ pageSize:  ListAttributes.pageSize, position: ListAttributes.paginationPosition }}
      />
    </div>
  );
}
