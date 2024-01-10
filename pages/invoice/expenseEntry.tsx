import React, { useState, useEffect } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import {  Form, Input, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios"
import moment from 'moment';



const ExpenseEntry = () => {

  const [open, setOpen] = useState(false);
  const { Search } = Input;
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState<any>(null);
  const [drawerTitle, setDrawerTitle] = useState("Create Expense")
  const [viewRecord, setViewRecord] = useState<any>(null)
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState<any>([])

  // Model 
  const showModal = (record: any) => {
    setIsModalOpen(true);
    setViewRecord(record)
    modalData()
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // get Tax datas
  useEffect(() => {
    getExpenceEntry()
  }, [])

  const getExpenceEntry = (() => {
    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    axios.get("http://files.covaiciviltechlab.com/expense_entry_list/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setDataSource(res?.data)
      setFilterData(res.data)
    }).catch((error: any) => {
      console.log(error)
    })
  })
  console.log("dataSourcedataSource", dataSource)



  useEffect(() => {
    axios.get("http://files.covaiciviltechlab.com/create_expense_entry/", {
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      setFormFields(res.data)
    }).catch((error: any) => {
      console.log(error)
    })
  }, [])

  console.log("formFields", formFields)



  useEffect(() => {
    if (editRecord) {
      setDrawerTitle("Edit Expense");
    } else {
      setDrawerTitle("Create Expense");
    }
  }, [editRecord, open]);



  // drawer
  const showDrawer = (record: any) => {
    console.log('✌️record --->', record);

    if (record) {
      const updateData: any = {
        amount: record.amount,
        date: moment(record.date),
        expense_category: record.expense_category,
        expense_user: record.expense_user,
        id: record.id,
        narration: record.narration
      }
      setEditRecord(updateData);
      form.setFieldsValue(updateData); // Set form values for editing
    } else {
      setEditRecord(null);
      form.resetFields();
    }

    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };




  const columns = [
    // {
    //   title: 'S No',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'Expense User',
      dataIndex: 'expense_user',
      key: 'expense_user',
    },
    {
      title: 'Expense Category',
      dataIndex: 'expense_category_name',
      key: 'expense_category_name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (

        <Space size="middle">
          <EyeOutlined style={{ cursor: "pointer" }}
            onClick={() => showModal(record)} className='view-icon' rev={undefined} />

          {
            localStorage.getItem('admin') === 'true' ? (
              <EditOutlined
                style={{ cursor: "pointer" }}
                onClick={() => showDrawer(record)}
                className='edit-icon'
                rev={undefined}
              />
            ) : (
              <EditOutlined
                style={{ cursor: "pointer", display: "none" }}
                onClick={() => showDrawer(record)}
                className='edit-icon'
                rev={undefined}
              />
            )
          }


          {/* <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record)}
            className='edit-icon' rev={undefined} />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} /> */}
        </Space>
      ),
    }
  ];



  const handleDelete = (record: any,) => {

    const Token = localStorage.getItem("token")

    Modal.confirm({
      title: "Are you sure, you want to delete this EXPENSE ENTRY record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        console.log(record, "values")
        axios.delete(`http://files.covaiciviltechlab.com/delete_expense_entry/${record.id}`, {
          headers: {
            "Authorization": `Token ${Token}`
          }
        }).then((res) => {
          console.log(res)
          getExpenceEntry()
        }).catch((err) => {
          console.log(err)
        })

      },
    });
  };



  // input search
  const [filterData, setFilterData] = useState(dataSource)

  const inputChange = ((e: any) => {
    const SearchValue = e.target.value

    const filteredData = dataSource.filter((item: any) => {
      return (
        item?.narration?.toLowerCase().includes(SearchValue.toLowerCase()) || item?.expense_category_name?.toLowerCase().includes(SearchValue.toLowerCase()) || item?.expense_user?.toLowerCase().includes(SearchValue.toLowerCase())
      )
    })
    setFilterData(filteredData)
  })


  // form submit
  const onFinish = (values: any,) => {
    console.log('Success:', values);


    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    const formattedData = {
      ...values,
      expense_user: values.expense_user,
      date: moment(values.dob).format("YYYY-MM-DD"),
      expense_category: values.expense_category,
      amount: values.amount,
      narration: values.narration,

    };

    console.log("formattedData", formattedData)

    // Check if editing or creating
    if (editRecord) {
      axios.put(`http://files.covaiciviltechlab.com/edit_expense_entry/${editRecord.id}/`, formattedData, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res: any) => {
        // Successful response
        getExpenceEntry()
        console.log(res);
        setOpen(false);
      }).catch((error: any) => {
        // Error handling
        console.log(error);
      });
    } else {
      // Making a POST request using Axios
      axios.post("http://files.covaiciviltechlab.com/create_expense_entry/", formattedData, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res: any) => {
        getExpenceEntry()
        console.log(res);
        setOpen(false);
      }).catch((error: any) => {
        // Error handling
        console.log(error);
      });

      // Clear form fields
      form.resetFields();
    }
    // Close the drawer
    onClose();
  }


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    expense_user?: string;
    expense_category?: string;
    amount?: string;
    narration?: string;
    date?: string;
  };
  // console.log("viewRecordviewRecord", viewRecord)


  // Model Data
  const modalData = () => {
    const formatDate = (dateString: any) => {
      if (!dateString) {
        return "N/A"; // or handle it according to your requirements
      }

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid Date"; // or handle it according to your requirements
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const data = [
      {
        label: "Expense User:",
        value: viewRecord?.expense_user || "N/A",
      },
      {
        label: "Expense Category:",
        value: viewRecord?.expense_category || "N/A",
      },
      {
        label: "Amount:",
        value: viewRecord?.amount || "N/A",
      },
      {
        label: "Narration:",
        value: viewRecord?.narration || "N/A",
      },
      {
        label: "Date:",
        value: formatDate(viewRecord?.date),
      },
      {
        label: "Created By:",
        value: viewRecord?.created_by || "N/A",
      },
      {
        label: "Created Date:",
        value: formatDate(viewRecord?.created_date),
      },
      {
        label: "Modified By:",
        value: viewRecord?.modified_by || "N/A",
      },
      {
        label: "Modified Date:",
        value: formatDate(viewRecord?.modified_date),
      },
    ];

    return data;
  };


  return (
    <>
      <div className='panel'>
        <div className='tax-heading-main'>
          <div>
            <h1 className='text-lg font-semibold dark:text-white-light'>Manage Expense Entry</h1>
          </div>
          <div>
            <Search placeholder="Input search text" onChange={inputChange} enterButton className='search-bar' />
            <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Expense Entry</button>
          </div>
        </div>
        <div className='table-responsive'>
          <Table dataSource={filterData} columns={columns} pagination={false} />
        </div>

        <Drawer title={drawerTitle} placement="right" width={600} onClose={onClose} open={open}>
          <Form
            name="basic"
            layout="vertical"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"

          >
            <Form.Item
              label="Expense User"
              name="expense_user"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Expense Category"
              name="expense_category"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Select
                placeholder="Select a expense category">
                {formFields?.expense?.map((val: any) => (
                  <Select.Option key={val.id} value={val.id}>
                    {val.expense_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Amount"
              name="amount"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Narration"
              name="narration"
              required={true}
              rules={[{ required: true, message: 'Please input your Narration!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Date" name="date"
              required={true}
              rules={[{ required: true, message: 'Please input your Date!' }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item >
              <div className='form-btn-main'>
                <Space>
                  <Button danger htmlType="submit" onClick={() => onClose()}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Space>

              </div>

            </Form.Item>
          </Form>
        </Drawer>


        {/* Modal */}
        <Modal title="View Expense Entry" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
          {
            modalData()?.map((value: any) => {
              return (
                <>
                  <div className='content-main' >
                    <p className='content-1'>{value?.label}</p>
                    <p className='content-2'>{value?.value}</p>
                  </div>
                </>
              )
            })
          }
        </Modal>

      </div>
    </>
  )
}

export default ExpenseEntry