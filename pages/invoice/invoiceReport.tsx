import React, { useEffect, useState, useRef } from 'react'
import axios from "axios"
import { useRouter } from 'next/router';
import { Space,Form, Select, Button, Radio, message } from 'antd';
import "react-quill/dist/quill.snow.css";


const InvoiceReport = () => {

  const editorRef: any = useRef();
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();

  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}
  const [invoiceReport, setInvoiceReport] = useState<any>([])
  const [editor, setEditor] = useState<any>("<p>Your HTML content here</p>")
  const [messageApi, contextHolder] = message.useMessage();
  const [date, setDate] = useState()

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    }
    setEditorLoaded(true)
  }, [])




  const getTestReport = (() => {
    const Token = localStorage.getItem("token")

    axios.get(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, {
      headers: {
        "Authorization": `Token ${Token}`
      }
    }).then((res) => {
      setDate(res.data.invoice_test.report_template)
      setInvoiceReport(res.data)

      // let apiResponse: any = date; 

      // let tempDiv = document.createElement('div');
      // tempDiv.innerHTML = apiResponse;

      // let tdElements = tempDiv.querySelectorAll('td');
      // tdElements.forEach(tdElement => {
      //   if (tdElement.innerText.trim() === 'Date :') {
      //     tdElement.innerHTML = 'Date : 26-01-2024';
      //   }
      //   if (tdElement.innerText.trim() === 'Test Order No:') {
      //     tdElement.innerHTML = 'Test Order No: 5';
      //   }
      // });

      // let modifiedApiResponse = tempDiv.innerHTML;
      // setEditor(modifiedApiResponse)

      // console.log("modify", modifiedApiResponse);
    }).catch((error: any) => {
      console.log(error)
    });
  });

  useEffect(() => {
    // Ensure that the CKEditor is loaded and the date is available
    if (editorLoaded && date) {
      // Create a temporary div element to parse the HTML
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = date;

      // Find the td elements and update the date
      let tdElements = tempDiv.querySelectorAll('td');
      tdElements.forEach((tdElement) => {
        if (tdElement.innerText.trim() === 'Date :') {
          const TestReportDate = "30-4-2024"
          tdElement.innerHTML = `Date : ${TestReportDate}`;
        }
        if (tdElement.innerText.trim() === 'Test Order No:') {
          const testOrderNo = "1"
          tdElement.innerHTML = `Test Order No: ${testOrderNo}`;
        }
      });

      let modifiedApiResponse = tempDiv.innerHTML;
      setEditor(modifiedApiResponse);

      console.log("modify", modifiedApiResponse);
    }
  }, [editorLoaded, date]);


  useEffect(() => {
    getTestReport()
  }, [id])


  console.log("editor", editor)


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


  const handleEditorChange = (data: any) => {
    setEditor(data);
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
        <div style={{ textAlign: "end" }}>
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
            >
              <div dangerouslySetInnerHTML={{ __html: editor }} style={{ display: "none" }} />
              {editorLoaded &&
                <CKEditor
                  editor={ClassicEditor}
                  data={editor}
                  onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    handleEditorChange(data);
                  }}
                />
              }
            </Form.Item>
            <Form.Item label="Completed" name="completed"
              required={true}
              rules={[{ required: true, message: 'Please Select your Completed Status!' }]}
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
              rules={[{ required: true, message: 'Please select a Employee Name!' }]}
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