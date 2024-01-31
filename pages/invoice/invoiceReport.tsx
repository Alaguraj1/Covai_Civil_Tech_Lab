import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Space, Form, Select, Button, Radio, message } from 'antd';
import 'react-quill/dist/quill.snow.css';

const InvoiceReport = () => {
    const editorRef: any = useRef();
    const router = useRouter();
    const { id } = router.query;
    const [form] = Form.useForm();

    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};
    const [invoiceReport, setInvoiceReport] = useState<any>([]);
    const [editor, setEditor] = useState<any>('<p>Your HTML content here</p>');
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState<any>({
        completed: '',
        signature: '',
    });
    const [selectedId, setSelectedId] = useState<any>(1);
    console.log('✌️selectedId --->', selectedId);

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        };
        setEditorLoaded(true);
    }, []);

    const getTestReport = () => {
        const Token = localStorage.getItem('token');

        axios
            .get(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, {
                headers: {
                    Authorization: `Token ${Token}`,
                },
            })
            .then((res) => {
                console.log('✌️res --->', res);

                const sampleObj = {
                    id: 1,
                    employee_name: 'Select employee ',
                };

                if (res.data.invoice_test.signature == null) {
                    res.data.signatures.unshift(sampleObj);
                }
                const resData = {
                    invoice: res.data.invoice,
                    invoice_test: res.data.invoice_test,
                    signatures: res.data.signatures,
                };
                console.log('✌️resData --->', resData);

                setInvoiceReport(resData);

                console.log('✌️res.data --->', res.data);
              
                setEditor(res.data.invoice_test.report_template);
                setSelectedId(1);
                if(res.data.invoice_test.signature == null){
                  setFormData({
                    signature: 1,
                    completed: res.data.invoice_test.completed,
                });
                }
                const filter = res.data.signatures.filter((element: any) => element.id == res.data.invoice_test.signature);
                console.log('✌️filter --->', filter[0].id);
                setFormData({
                    signature: filter[0].id,
                    completed: res.data.invoice_test.completed,

                });
                setSelectedId(filter[0].id);
            })
            .catch((error: any) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getTestReport();
    }, [id]);

    useEffect(() => {
        getTestReport();
    }, []);

    // form submit
    const onFinish = (value: any) => {
        if (selectedId == 1) {
            messageApi.open({
                type: 'error',
                content: 'Please Select Employee Name',
            });
        } else {
            const body = {
                report_template: editor,
                completed: formData.completed,
                signature: selectedId,
            };

            const Token = localStorage.getItem('token');

            axios
                .put(`http://files.covaiciviltechlab.com/edit_invoice_test_template/${id}/`, body, {
                    headers: {
                        Authorization: `Token ${Token}`,
                    },
                })
                .then((res) => {
                    console.log('update --->', res);
                    getTestReport();
                    messageApi.open({
                        type: 'success',
                        content: 'Invoice Report Successfully Updated',
                    });
                })
                .catch((error) => {
                    console.error('Error updating report template:', error);
                    messageApi.open({
                        type: 'error',
                        content: 'Invoice Report Updated Failed',
                    });
                });
        }
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

    const inputChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className="panel" style={{ margin: '30px' }}>
                <div style={{ textAlign: 'end' }}>
                    <Button type="primary" onClick={() => goBack()}>
                        {' '}
                        Go Back{' '}
                    </Button>
                </div>

                <div>
                    {contextHolder}
                    <Form
                        name="basic"
                        layout="vertical"
                        form={form}
                        // initialValues={{
                        //   remember: true,

                        // }}

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="Edit Report Template" name="report_template" required={false}>
                            <div dangerouslySetInnerHTML={{ __html: editor }} style={{ display: 'none' }} />
                            {editorLoaded && (
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editor}
                                    onChange={(event: any, editor: any) => {
                                        const data = editor.getData();
                                        handleEditorChange(data);
                                    }}
                                />
                            )}
                        </Form.Item>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Completed
                            </label>
                            <div className="mt-0 flex items-center  font-semibold ">
                                <input id="swift-code-yes" type="radio" name="completed" value="Yes" onChange={inputChange} checked={formData?.completed === 'Yes'} />
                                <label style={{ marginRight: '3px', marginBottom: '0px' }}>Yes</label>

                                <input id="swift-code-no" type="radio" name="completed" value="No" onChange={inputChange} checked={formData?.completed === 'No'} style={{ marginLeft: '20px' }} />
                                <label style={{ marginRight: '3px', marginBottom: '0px' }}>No</label>
                            </div>
                        </div>

                        {/* <Form.Item
              label="Completed"
              name="completed"
              required={true}
              rules={[{ required: true, message: 'Please Select your Completed Status!' }]}
            >
              <Radio.Group  defaultValue={invoiceReport?.invoice_test?.completed == "Yes" ?true:false}>
                <Radio >
                  Yes
                </Radio>
                <Radio  >
                  No
                </Radio>
              </Radio.Group>
            </Form.Item> */}

                        {/* <Form.Item
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
            </Form.Item> */}
                        {/* <div className="mt-4 flex items-center"> */}
                        {/* <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                Customer Name
              </label>
              <select value={2} onChange={(e) => setFormData({ signature: parseInt(e.target.value) })} id="country" className="form-select flex-1" name="signature"
              >
                {invoiceReport?.signatures?.map((value: any) => (
                  <option key={value.id} value={value.id}>
                    {value?.employee_name}
                  </option>
                ))}
              </select> */}
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="yourSelect">Employee Name</label>
                            <select id="yourSelect" value={selectedId} onChange={(e) => setSelectedId(parseInt(e.target.value))} className="form-select flex-1">
                                {invoiceReport?.signatures?.map((element: any) => (
                                    <option key={element.id} value={element.id}>
                                        {element.employee_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Form.Item>
                            <div className="form-btn-main">
                                <Space>
                                    {invoiceReport?.invoice_test?.completed == 'Yes' && invoiceReport.invoice_test?.signature != '' ? (
                                        <>
                                            <Button type="primary" onClick={() => handlePrint()}>
                                                Print
                                            </Button>
                                            <Button type="primary" onClick={() => handlePrint1()}>
                                                Print Without Header
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button type="primary" onClick={() => handlePrint()} disabled>
                                                Print
                                            </Button>
                                            <Button type="primary" onClick={() => handlePrint1()} disabled>
                                                Print Without Header
                                            </Button>
                                        </>
                                    )}

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
    );
};

export default InvoiceReport;
