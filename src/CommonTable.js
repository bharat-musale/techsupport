import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Input, Space, Empty } from "antd";
import { toast } from "react-toastify";
import "./App.css";
const CommonTable = () => {
  const [custList, setCustList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [techRole, setTechRole] = useState([]);
  const userrole = sessionStorage.getItem("userrole");
  const username = sessionStorage.getItem("username");
  console.log(userrole, username);
  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    if (userrole && username) {
      getAllQueries();
    }
  }, [username, userrole]);
  const getUsers = () => {
    fetch("https://techsupport-k0vf.onrender.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch queries");
        }
        return res.json();
      })
      .then((data) => {
        let roleList = data.filter(
          (roleList) => roleList && roleList.role === "techSupport"
        );
        setTechRole(roleList || []);
      })
      .catch((error) => {
        console.error("Error fetching queries:", error);
        toast.error("Failed to fetch queries");
      });
  };
  const getAllQueries = () => {
    fetch("https://techsupport-k0vf.onrender.com/query")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch queries");
        }
        return res.json();
      })
      .then((data) => {
        if (userrole === "techSupport") {
          const filteredData = data.filter((item) => item.assign === username);
          setCustList(filteredData);
        } else if (userrole === "user") {
          console.log(data);
          const filteredData = data.filter(
            (item) => item.username === username
          );
          setCustList(filteredData);
        } else {
          setCustList(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching queries:", error);
        toast.error("Failed to fetch queries");
      });
  };

  const submitQuery = () => {
    const username = sessionStorage.getItem("username");
    const regobj = {
      username,
      query,
      reply: "",
      status: "created",
      assign: "",
    };

    fetch("https://techsupport-k0vf.onrender.com/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regobj),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add query");
        }
        return res.json();
      })
      .then(() => {
        toast.success("Added Query successfully.");
        setModalVisible(false);
        getAllQueries();
      })
      .catch((error) => {
        console.error("Error adding query:", error);
        toast.error("Failed to add query");
      });
  };

  const handleRemove = (record) => {
    fetch(`https://techsupport-k0vf.onrender.com/query/${record.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...record, status: "closed" }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Query closed successfully.");
          getAllQueries();
        } else {
          throw new Error("Failed to close query.");
        }
      })
      .catch((error) => {
        console.error("Error closing query:", error);
        toast.error("Failed to close query.");
      });
  };

  const replayQuery = (value, record, index) => {
    const newCustList = custList.map((item) => {
      if (item.id == index.id) {
        return { ...item, reply: value };
      }
      return item;
    });
    setCustList(newCustList);
  };
  const ChangeAssign = (value, record, index) => {
    console.log(value.target.value);
    const newCustList = custList.map((item) => {
      if (item.id === index.id) {
        return { ...item, assign: value.target.value };
      }
      return item;
    });
    submitQueryAssigne(newCustList.find((item) => item.id === index.id));
    setCustList(newCustList);
  };

  const submitQueryAssigne = (record) => {
    console.log(record);
    fetch(`https://techsupport-k0vf.onrender.com/query/${record.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update query");
        }
        toast.success("Query Assigned successfully.");
        getAllQueries();
      })
      .catch((error) => {
        console.error("Error updating query:", error);
        toast.error("Failed to submit query reply.");
      });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      className: userrole === "user" && "hidden-column",
    },
    {
      title: "Assigned To",
      dataIndex: "assign",
      key: "assign",
      className: userrole !== "user" && userrole !== "admin" && "hidden-column",
    },
    {
      title: "Query",
      dataIndex: "query",
      key: "query",
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (record, index) => (
        <textarea
          style={{ width: "100%" }}
          value={record}
          onChange={(e) => replayQuery(e, record, index)}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Assign To",
      dataIndex: "assign",
      key: "assign",
      render: (record, index) => (
        <select value={record} onChange={(e) => ChangeAssign(e, record, index)}>
          <option value="">Select User</option>
          {techRole.map((role, roleIndex) => (
            <option key={roleIndex} value={role.name}>
              {role.name}
            </option>
          ))}
          <option value="None">None</option>
        </select>
      ),
      className: userrole != "admin" && "hidden-column",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => submitQueryReply(record)} type="primary">
            Submit Reply
          </Button>
          <Button onClick={() => handleRemove(record)} type="default">
            Close
          </Button>
        </Space>
      ),
    },
  ];

  const submitQueryReply = (record) => {
    fetch(`https://techsupport-k0vf.onrender.com/query/${record.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update query");
        }
        toast.success("Query reply submitted successfully.");
        getAllQueries(); // Refresh the query list
      })
      .catch((error) => {
        console.error("Error updating query:", error);
        toast.error("Failed to submit query reply.");
      });
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h3>Queries :</h3>
        </div>
        <div className="card-body">
          <Modal
            title="Add Query"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={submitQuery}
          >
            <label>Add Query</label>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query"
            />
          </Modal>
          {userrole === "user" && (
            <Button onClick={handleAdd} type="primary" className="mb-3">
              Add Query
            </Button>
          )}
          {custList?.length > 0 ? (
            <Table columns={columns} dataSource={custList} pagination={false} />
          ) : (
            <Empty></Empty>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
