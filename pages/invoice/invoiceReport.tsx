import React, { useEffect, useState, useRef } from 'react'
import axios from "axios"
import { useRouter } from 'next/router';
import { Space, Table, Modal, Form, Input, Select, Button, Drawer, Radio, message } from 'antd';
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
import form from 'antd/es/form';
import Link from 'next/link';

import { Editor } from '@tinymce/tinymce-react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const InvoiceReport = () => {

  const editorRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const [form] = Form.useForm();
  const [invoiceReport, setInvoiceReport] = useState<any>([])
  const [editor, setEditor] = useState<any>("<p>Your HTML content here</p>")
  const [messageApi, contextHolder] = message.useMessage();

  const getTestReport = (() => {
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
  })

  useEffect(() => {
    getTestReport()
  }, [id])




  // form submit
  const onFinish = (value: any) => {

    const body = {
      report_template: editor,
      completed: value.completed,
      signature: value.signature
    }
    const Token = localStorage.getItem("token");

    axios.put(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, body, {
      headers: {
        "Authorization": `Token ${Token}`,
      },
    }).then((res) => {
      getTestReport()
      messageApi.open({
        type: 'success',
        content: 'Invoice Report Successfully Updated',
      });
    }).catch((error) => {
      console.error("Error updating report template:", error);
      messageApi.open({
        type: 'error',
        content: 'Invoice Report Updated Failed',
      });
    });
  };


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const handleEditorChange = (value: any) => {
    setEditor(value.level.content);
  };


  // Print
  const handlePrint = () => {

    var id: any = invoiceReport.invoice_test.id;
    var url = `/invoice/print?id=${id}`;

    window.open(url, '_blank');
  };



  // Print
  const handlePrint1 = () => {

    var id: any = invoiceReport.invoice_test.id;
    var url = `/invoice/print1?id=${id}`;

    window.open(url, '_blank');
  };


  // Print
  const goBack = () => {
    window.location.href = `/invoice/edit?id=${invoiceReport.invoice.id}`;
  };
  return (
    <>
      <div className='panel' style={{ margin: "30px" }}>
        <div style={{textAlign:"end"}}>
          <Button type="primary" onClick={() => goBack()}> Go Back </Button>
        </div>

        <div>
          {contextHolder}
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
              label="Edit Report Template"
              name="report_template"
              required={false}
            // rules={[{ required: true, message: 'Please input your Report Templates!' }]}
            >
              <div dangerouslySetInnerHTML={{ __html: editor }} style={{ display: "none" }} />
              <Editor
                apiKey='4nwikn94zwvps0hbggwtumfo1vauvnz2sjsw50m8ji615iqw'
                onChange={handleEditorChange}
                onInit={(evt, editor:any) => editorRef.current = editor}
                initialValue={editor}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen image',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar: 'table undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
            </Form.Item>
            <Form.Item label="Completed" name="completed"
              required={true}
              rules={[{ required: true, message: 'Please Select your Gender!' }]}
            >
              <Radio.Group>
                <Radio value="Yes"> Yes </Radio>
                <Radio value="No"> No </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Employee Name"
              name="signature"
              required={false}
              rules={[{ required: true, message: 'Please select a Material ID!' }]}
            >
              <Select >
                {invoiceReport?.signatures?.map((value: any) => (
                  <Select.Option key={value.id} value={value.id}>
                    {value.employee_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item >
              <div className='form-btn-main'>
                <Space>

                  <Button type="primary" onClick={() => handlePrint()} >
                    Print
                  </Button>
                  <Button type="primary" onClick={() => handlePrint1()} >
                    Print Without Header
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Space>

              </div>

            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default InvoiceReport