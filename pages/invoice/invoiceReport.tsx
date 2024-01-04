import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useRouter } from 'next/router';
import { Space, Table, Modal, Form, Input, Select, Button, Drawer } from 'antd';
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
import form from 'antd/es/form';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const InvoiceReport = () => {

  const router = useRouter();
  const { id } = router.query;

  const [form] = Form.useForm();
  const [invoiceReport, setInvoiceReport] = useState<any>([])
  const [editor, setEditor] = useState<any>("<p>Your HTML content here</p>")



  useEffect(() => {

    const Token = localStorage.getItem("token")
    axios.get(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`,
      {
        headers: {
          "Authorization": `Token ${Token}`
        }
      }).then((res) => {
        setInvoiceReport(res.data)
        setEditor(res.data.invoice_test.report_template)
      }).catch((error: any) => {
        console.log(error)
      })
  }, [id])

  console.log("invoiceReport", invoiceReport)



  // form submit
  const onFinish = () => {
console.log("editoreditor", editor)

const body = {
  report_template : editor
}

    const Token = localStorage.getItem("token");

    axios.put(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, body , {
      headers: {
        "Authorization": `Token ${Token}`,
      },
    }).then((res) => {
      console.log("Report template updated successfully:", res.data);
    }).catch((error) => {
      console.error("Error updating report template:", error);
    });
  };


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const handleEditorChange = (value: any) => {
console.log('✌️value --->', value);
    setEditor(value);
  };

  console.log("editor", editor)
  return (
    <>
      <div style={{ padding: "50px" }}>
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
            label="Report Template"
            name="report_template"
            required={false}
            // rules={[{ required: true, message: 'Please input your Report Templates!' }]}
          >
            <div dangerouslySetInnerHTML={{ __html: editor }} style={{display:"none"}} />
            <ReactQuill
              value={editor}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  ["blockquote", "code-block"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "video"],
                  ["clean"],
                  // Add your custom features here
                ],
              }}
            />
          </Form.Item>
          <Form.Item >
            <div className='form-btn-main'>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Space>

            </div>

          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default InvoiceReport