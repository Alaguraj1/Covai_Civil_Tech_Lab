import { size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Checkbox, Form, Input, Select, } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from "axios"
import TextArea from 'antd/es/input/TextArea';

const Report = () => {

  const [open, setOpen] = useState(false);
  const { Search } = Input;
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null)
  const [drawerTitle, setDrawerTitle] = useState("Create Report Templates")
  const [viewRecord, setViewRecord] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFields, setFormFields] = useState([])
  const [dataSource, setDataSource] = useState([])

  const [editor, setEditor] = useState("")


  useEffect(() => {
    if (editRecord) {
      setDrawerTitle("Edit Report Templates")
    } else {
      setDrawerTitle("Create Report Templates")
    }
  }, [])


  // get Method 
  useEffect(() => {
    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    axios.get("http://files.covaiciviltechlab.com/create_report_template/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setFormFields(res?.data)
    }).catch((error: any) => {
      console.log(error)
    })
  }, [])

  console.log("formFields", formFields)
  console.log("dataSource", dataSource)

  // Get Method
  useEffect(() => {
    getTemplate()
  }, [])


  const getTemplate = (() => {
    const Token = localStorage.getItem("token")
    console.log("TokenTokenTokenToken", Token)

    axios.get("http://files.covaiciviltechlab.com/report_template_list/", {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res: any) => {
      setDataSource(res.data)
    }).catch((error: any) => {
      console.log(error)
    })
  })


  // drawer
  const showDrawer = (record: any) => {
    console.log("recordrecordrecordrecord", record)


    if (record) {
      const templateRecord = {
        material: record.material.id,
        report_template_name: record.report_template_name,
        print_format: record?.print_format.id,
        letter_pad_logo: record?.letter_pad_logo.id,
        template: record?.template,
        id: record?.id
      }
      console.log('templateRecord --->', templateRecord);
      setEditor(record?.template,)
      setEditRecord(templateRecord)
      form.setFieldsValue(templateRecord)
      // setEditor(templateRecord)
    } else {
      setEditRecord(null)
      form.resetFields()
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };



  // modal
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




  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'report_template_name',
      key: 'report_template_name',
    },
    {
      title: 'Material Name',
      dataIndex: 'material',
      key: 'material',
      render: (material: any) => (material && material.name) || 'N/A',
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (

        <Space size="middle">
          <EyeOutlined style={{ cursor: "pointer" }}
            onClick={() => showModal(record)} className='view-icon' rev={undefined} />
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record)}
            className='edit-icon' rev={undefined} />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} />
        </Space>
      ),
    }
  ];



  const handleDelete = (record: any) => {
    // Implement your delete logic here

    Modal.confirm({
      title: "Are you sure, you want to delete this REPORT TEMPLATES record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        console.log(record, "values")
        axios.delete(`http://files.covaiciviltechlab.com/delete_report_template/${record?.id}/`,
          {
            headers: {
              "Authorization": `Token ${localStorage.getItem("token")}`
            }
          }).then((res) => {
            getTemplate()
            console.log(res)
          }).catch((err) => {
            console.log(err)
          })

      },
    });
  };

  // input search
  const onSearch = (value: string, _e: any, info: any) => {
    const filteredData = dataSource.filter((item: any) =>
      item.reportName.toLowerCase().includes(value.toLowerCase())
    );

    setDataSource(filteredData);
  };



  // form submit
  const onFinish = (values: any) => {
    const templateText = values.template?.blocks?.[0]?.text || '';

    const body = {
      material: values.material,
      report_template_name: values.report_template_name,
      print_format: values.print_format,
      letter_pad_logo: values.letter_pad_logo,
      template: templateText
    };

    const Token = localStorage.getItem("token");

    if (editRecord) {
      axios.put(`http://files.covaiciviltechlab.com/edit_report_template/${editRecord.id}/`, body, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res) => {
        setOpen(false);
        getTemplate();
      }).catch((error) => {
        console.log(error);
      });
    } else {
      axios.post("http://files.covaiciviltechlab.com/create_report_template/", body, {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res) => {
        form.resetFields();
        setOpen(false);
        getTemplate();
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    material?: any;
    report_template_name?: any;
    template?: any;
    print_format?: any;
    letter_pad_logo?: any
  };


  const editorOptions = {
    toolbar: {
      options: ["inline", "blockType", "fontSize", "fontFamily", "list", "textAlign", "colorPicker", "link", "embedded", "emoji", "image", "remove", "history"],
      inline: {
        options: ["bold", "italic", "underline", "strikethrough"],
      },
      blockType: {
        options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"],
      },
      fontSize: {
        options: [10, 12, 14, 16, 18, 24, 30],
      },
      fontFamily: {
        options: ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"],
      },
      list: {
        options: ["unordered", "ordered"],
      },
      textAlign: {
        options: ["left", "center", "right"],
      },
      colorPicker: {
        colors: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff"],
      },
      link: {
        options: ["link"],
      },
      embedded: {
        options: ["embedded"],
      },
      emoji: {
        options: ["emoji"],
      },
      image: {
        options: ["image"],
      },
      remove: {
        options: ["remove"],
      },
      history: {
        options: ["undo", "redo"],
      },
    },
  };



  // modal data
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
        label: "Report Template Name:",
        value: viewRecord?.report_template_name || "N/A",
      },
      {
        label: "Material Name:",
        value: viewRecord?.material.name || "N/A",
      },
      {
        label: "Templates:",
        value: viewRecord?.template,
      },
      {
        label: "Print Format:",
        value: viewRecord?.print_format.name || "N/A",
      },
      {
        label: "letter Pad Logo:",
        value: viewRecord?.letter_pad_logo.name || "N/A"
      },
    ];

    return data;
  };

  console.log("editoreditoreditor", editor)

  return (
    <>
      <div>
        <div className='tax-heading-main'>
          <div>
            <h1 className='tax-title'>Manage Report Templates</h1>
          </div>
          <div>
            <Search placeholder="input search text" onSearch={onSearch} enterButton className='search-bar' />
            <button type='button' onClick={() => showDrawer(null)} className='create-button'>+ Create Report</button>
          </div>
        </div>
        <div>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
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
            {/* <Form.Item label="Material ID" name='materialId'>
              <Select>
                {
                  formFields?.materials?.map((val: any) => {
                    return (
                      <>
                        <Select.Option value={val.id}>{val.id}</Select.Option>
                      </>
                    )
                  })
                }
              </Select>
            </Form.Item> */}


            <Form.Item
              label="Material Name"
              name="material"
              required={false}
              rules={[{ required: true, message: 'Please select Material Name!' }]}
            >
              <Select>
                {formFields?.materials?.map((val: any) => (
                  <Select.Option key={val.material_name} value={val.id}>
                    {val.material_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Report Name"
              name="report_template_name"
              required={false}
              rules={[{ required: true, message: 'Please input your Report Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Templates"
              name="template"
              required={false}
              rules={[{ required: true, message: 'Please input your Report Name!' }]}
            >
              <Editor
                wrapperClassName="wrapper"
                editorClassName="editor"
                toolbarClassName="toolbar"
                {...editorOptions}
                value={editor}
              />
              {/* <TextArea /> */}
            </Form.Item>


            <Form.Item label="Print Format" name='print_format'>
              <Select>
                {
                  formFields?.print_format?.map((val: any) => {
                    return (
                      <Select.Option value={val.id}>{val.name}</Select.Option>

                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="letter pad logo" name='letter_pad_logo'>
              <Select>
                {
                  formFields?.letter_pad_logo?.map((val: any) => {
                    return (
                      <Select.Option value={val?.id}>{val?.name}</Select.Option>

                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item >
              <div className='form-btn-main'>
                <Space>
                  <Button danger htmlType="submit" onClick={() => onClose()}>
                    cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Space>

              </div>

            </Form.Item>
          </Form>
        </Drawer>

        {/* modal */}
        <Modal title="View Report Template" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} style={{width:"700px"}}>
          {
            modalData()?.map((value: any) => {
              return (
                <>
                  <div className='content-main' >
                    <p className='content-1'>{value?.label}</p>
                    <p className='content-2' dangerouslySetInnerHTML={{__html : value?.value}}></p>
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

export default Report