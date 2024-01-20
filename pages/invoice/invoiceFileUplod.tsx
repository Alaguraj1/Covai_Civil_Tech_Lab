import React, { useState, useEffect } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Form, Input, message, Upload, Select } from 'antd';
import { EditOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios"
import type { UploadProps } from 'antd';


const InvoiceFileUpload = () => {

  const [open, setOpen] = useState(false);
  const { Search } = Input;
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState<any>(null);
  const [drawerTitle, setDrawerTitle] = useState("Create Tax")
  const [viewRecord, setViewRecord] = useState<any>(null)
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState<any>([])
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fileList, setFileList] = useState([]);



  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value);
    form.resetFields(['invoice', 'expense']);
  };

  // console.log("selectedCategory", selectedCategory)

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
    getFileUpload()
  }, [])

  const getFileUpload = (() => {
    const Token = localStorage.getItem("token")

    axios.get("http://files.covaiciviltechlab.com/invoice_file_upload_list/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setDataSource(res?.data?.invoice_files)
      setFilterData(res?.data?.invoice_files)
    }).catch((error: any) => {
      console.log(error)
    })
  })

  // console.log("datasource", dataSource)

  useEffect(() => {
    const Token = localStorage.getItem("token")

    axios.get("http://files.covaiciviltechlab.com/create_invoice_file_upload/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setFormFields(res?.data)
    }).catch((error: any) => {
      console.log(error)
    })
  }, [])


  useEffect(() => {
    if (editRecord) {
      setDrawerTitle("Edit File Upload");
    } else {
      setDrawerTitle("Create File Upload");
    }
  }, [editRecord, open]);



  // drawer
  const showDrawer = (record: any) => {
    // console.log('✌️record --->', record);
    if (record) {

      // if (record.invoice === null) {
      //   setSelectedCategory(record.expense)
      // } else {
      //   setSelectedCategory(record.invoice)
      // }


      setEditRecord(record);
      setSelectedCategory(record.category)
      const parsedUrl = new URL(record.file_url);
      const path = parsedUrl.pathname;
      const pathSegments = path.split('/');
      const filename = pathSegments[pathSegments.length - 1];
      const arr: any = [
        {
          uid: 'rc-upload-1',
          name: filename, // Assuming 'file_url' is the field with the existing file name
          status: 'done',
          url: record.file_url, // Assuming 'file_url' is the field with the file URL
        },
      ]
      setFileList(arr)
      form.setFieldsValue({
        invoice: record.invoice,
        category: record.category,
        expense: record.expense,
        file: arr

      });
    } else {
      setEditRecord(null);
      form.resetFields();
      setFileList([]);
    }

    setOpen(true);
  };


  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };




  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Category',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      key: 'invoice_no',
    },
    {
      title: 'Expense',
      dataIndex: 'expense',
      key: 'expense',
    },
    {
      title: 'File url',
      dataIndex: 'file_url',
      key: 'file_url',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a href={text} target="_blank" rel="noopener noreferrer">
            View
          </a>
          <Button onClick={() => handleDownload(record.file_url)}>Download</Button>
        </Space>
      ),
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

  const handleDownload = (fileUrl: any) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Open in a new tab/window
    link.rel = 'noopener noreferrer';
    link.click();
  };


  // const handleDelete = (record: any,) => {

  //   const Token = localStorage.getItem("token")

  //   Modal.confirm({
  //     title: "Are you sure, you want to delete this INVOICE FILE UPLOAD record?",
  //     okText: "Yes",
  //     okType: "danger",
  //     onOk: () => {
  //       axios.delete(`http://files.covaiciviltechlab.com/delete_invoice_file_upload/${record.id}`, {
  //         headers: {
  //           "Authorization": `Token ${Token}`
  //         }
  //       }).then((res) => {
  //         console.log(res.data)
  //         getFileUpload()
  //       }).catch((err) => {
  //         console.log(err)
  //       })

  //     },
  //   });
  // };



  // input search
  const [filterData, setFilterData] = useState(dataSource)
  const inputChange = (e: any) => {
    setFilterData(
      dataSource.filter((item: any) => {
        return item.category_name.toLowerCase().includes(e.target.value.toLowerCase())
      })
    )
  }



  // form submit
  const onFinish = (values: any) => {
    // console.log('✌️values --->', values);

    const Token = localStorage.getItem("token");

    // Create a FormData object to send files
    const formData = new FormData();
    formData.append("file", values.file.file.originFileObj);
    if (values.invoice !== undefined) {

      formData.append('invoice', values.invoice);
    }

    formData.append('category', values.category);

    if (values.expense !== undefined) {
      formData.append('expense', values.expense);

    }
    // console.log('✌️formData --->', formData);


    // Check if editing or creating
    if (editRecord) {
      axios.put(`http://files.covaiciviltechlab.com/edit_invoice_file_upload/${editRecord.id}/`, formData, {
        headers: {
          "Authorization": `Token ${Token}`,
          "Content-Type": "multipart/form-data",  // Set content type for file upload
        },
      }).then((res: any) => {
        // Successful response
        getFileUpload();
        // console.log(res);
        setOpen(false);
      }).catch((error: any) => {
        // Error handling
        console.log(error);
      });
    } else {
      // Making a POST request using Axios
      axios.post("http://files.covaiciviltechlab.com/create_invoice_file_upload/", formData, {
        headers: {
          "Authorization": `Token ${Token}`,
          "Content-Type": "multipart/form-data",  // Set content type for file upload
        },
      }).then((res: any) => {
        getFileUpload();
        // console.log(res);
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
  };



  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };



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
        label: "Invoice:",
        value: viewRecord?.invoice || "N/A",
      },
      {
        label: "Download:",
        value: viewRecord?.file_url || "N/A",
      },
      {
        label: "Category:",
        value: viewRecord?.category_name || "N/A",
      },
      {
        label: "Created By:",
        value: viewRecord?.created_by || "N/A",
      },
      {
        label: "Created Date:",
        value: formatDate(viewRecord?.created_date) || "N/A",
      },
      {
        label: "Modified By:",
        value: viewRecord?.modified_by || "N/A",
      },
      {
        label: "Modified Date:",
        value: formatDate(viewRecord?.modified_date) || "N/A",
      },
    ];

    return data;
  };


  // console.log("edit", form)



  // file upload
  const { Dragger } = Upload;

  const allowedFileTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  const handleRemove = (file: any) => {
    // Update the file list by filtering out the removed file
    setFileList((prevFileList) => prevFileList.filter(item => item.uid !== file.uid));
  };
  const props: UploadProps = {
    name: 'file',
    multiple: false, // Set to false to allow only a single file upload
    fileList: fileList,
    beforeUpload: (file) => {
      const fileType = file.type;
      console.log('✌️fileType --->', fileType); // Add this line for debugging

      if (!allowedFileTypes.includes(fileType)) {
        message.error('Only PDF and Excel files are allowed!');
        return false; // Prevent the file from being uploaded
      }

      return true; // Allow the file to be uploaded
    },
    onChange(info: any) {
      // console.log('✌️info --->', info);
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList(info.fileList);
    },
    onRemove: handleRemove
  };



  return (
    <>
      <div className='panel'>
        <div className='tax-heading-main'>
          <div>
            <h1 className='text-lg font-semibold dark:text-white-light'>Expense File Upload</h1>
          </div>
          <div>
            <Search placeholder="Input search text" onChange={inputChange} enterButton className='search-bar' />
            <button type='button' onClick={() => {
              showDrawer(null)

            }} className='create-button'>+ File Upload</button>
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
              label="Category"
              name="category"
              required={true}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Select
                placeholder="Select a Category"
                onChange={handleCategoryChange}
              >
                {formFields?.categories?.map((val: any) => (
                  <Select.Option key={val.id} value={val.id}>
                    {val.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCategory === 2 && (
              <Form.Item
                label="Invoice"
                name="invoice"
                required={true}
                rules={[{ required: true, message: 'This field is required.' }]}
              >
                <Select
                  placeholder="Select an Invoice"
                >
                  {formFields?.invoices?.map((val: any) => (
                    <Select.Option key={val.id} value={val.id}>
                      {val.invoice_no} - {val.customer} - {val.customer_no}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {selectedCategory === 3 && (
              <Form.Item
                label="Expense Entry"
                name="expense"
                required={true}
                rules={[{ required: true, message: 'This field is required.' }]}
              >
                <Select
                  placeholder="Select an Expense Entry"
                >
                  {formFields?.expense_entries?.map((val: any) => (
                    <Select.Option key={val.id} value={val.id}>
                      {val.expense_user} - {val.expense_category_name} - {val.amount}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="File"
              name="file"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please upload a single PDF or Excel file.',
                  validator: (_, value) => {
                    // Validate that the file is selected
                    if (!value || value.fileList.length === 0) {
                      return Promise.reject('Please upload a PDF or Excel file.');
                    }
                    // Validate that only a single file is selected
                    if (value.fileList.length > 1) {
                      return Promise.reject('Only one file is allowed.');
                    }
                    // Validate that the file type is allowed
                    const fileType = value.fileList[0].type;
                    if (!allowedFileTypes.includes(fileType)) {
                      return Promise.reject('Only PDF and Excel files are allowed.');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined rev={undefined} />
                </p>
                <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload</p>
                <p className="ant-upload-text">Only single PDF or Excel file allowed</p>
              </Dragger>
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
        <Modal title="View File" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
          <div style={{ overflow: "scroll" }}>
            {
              modalData()?.map((value: any) => {
                return (
                  <>
                    <div className='content-main'>
                      <p className='content-1'>{value?.label}</p>
                      <p className='content-2'>{value?.value}</p>
                    </div>
                  </>
                )
              })
            }
          </div>

        </Modal>

      </div>
    </>
  )
}

export default InvoiceFileUpload