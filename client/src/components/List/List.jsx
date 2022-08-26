import { Table } from "antd";
import { ListAttributes} from "../../constant/listAttributes";
import { typeOfStatus } from "../../constant/status";
import "./List.css";

export default function List({
  updateTaskList,
  data,
  selectedRowKeys,
  setSelectedRowKeys,
}) {
  const {subListIndent, pageSize, paginationPosition, rowSelectionType, statusColors}  = ListAttributes;
  const columns = [
    { title: "Task ID", dataIndex: "task_id", key: "task_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if(status === typeOfStatus.IN_PROGRESS) {
          return (<span style={{color: statusColors.IN_PROGRESS}}>&#9673; <b style={{color: statusColors.DEFAULT}}>{status}</b></span>)
        } else if(status === typeOfStatus.DONE){
          return <span style={{color: statusColors.DONE}}>&#9673; <b style={{color: statusColors.DEFAULT}}>{status}</b></span>
        }else if(status === typeOfStatus.COMPLETE){
          return <span style={{color: statusColors.COMPLETE}}>&#9673; <b style={{color: statusColors.DEFAULT}}>{status}</b></span>
        }
      },
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
  ];
  
  return (
    <div>
      <Table
        className="components-table-demo-nested"
        rowSelection={{
          selectedRowKeys,
          type: rowSelectionType,
          hideSelectAll: true,
          onSelect: (record, _, selectedRows) => {
            updateTaskList(record);
            setSelectedRowKeys(selectedRows.map((row) => row.key));
          },
        }}
        columns={columns}
        indentSize={subListIndent}
        dataSource={[...data]}
        pagination={{
          pageSize: pageSize,
          position: paginationPosition,
        }}
      />
    </div>
  );
}
