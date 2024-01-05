import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconX from '@/components/Icon/IconX';
import IconSave from '@/components/Icon/IconSave';
import IconSend from '@/components/Icon/IconSend';
import IconEye from '@/components/Icon/IconEye';
import IconDownload from '@/components/Icon/IconDownload';
import { Button, Modal, Checkbox, Form, Input, Select, Space, Drawer } from 'antd';
import type { SelectProps } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DeleteOutlined, EditOutlined, PrinterOutlined, } from '@ant-design/icons';

const Edit = () => {

    const router = useRouter();
    const { id } = router.query;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice Edit'));
    });

    const [editRecord, setEditRecord] = useState(null);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm()
    const [discount, setDiscount] = useState<any>(0);
    const [shippingCharge, setShippingCharge] = useState<any>(0);
    const [paymentMethod, setPaymentMethod] = useState<any>('bank');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testFormData, setTestFormData] = useState<any>([])
    const [tableVisible, setTableVisible] = useState(false)
    const [filterMaterial, setFilterMaterial] = useState([])
    const [filterTest, setFilterTest] = useState<any>([])
    const [invoiceFormData, setInvoiceFormData] = useState<any>({})
    const [customerAddress, setCustomerAddress] = useState('');
    const [tax, setTax] = useState([])
    
    const [taxPercentage, setTaxPercentage] = useState('')
    const [balance, setBalance] = useState('')
    const [taxCalculated, setTaxCalculated] = useState('')
    const [afterTax, setAfterTax] = useState<any>('')
    const [beforeTotalTax, setBeforeTotalTax] = useState<any>(0)
    const [advance, setAdvance] = useState(0)

    const [formData, setFormData] = useState({
        customer: "",
        sales_mode: "",
        project_name: "",
        discount: "",
        tax: "",
        advance: "",
        date: "",
        payment_mode: "",
        cheque_number: "",
        bank: "",
        amount_paid_date: "",
        before_tax: "",
    });
    // console.log('✌️formData --->', formData);

    // console.log("abc", formData)

    const tableTogle = () => {
        setTableVisible(!tableVisible)
    }
    const inputChange = ((e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        }
        )
    })


    const getInvoiceTestData = () => {
        axios.get(`http://files.covaiciviltechlab.com/edit_invoice/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            let response = res.data;
            let mergeArray: any = [response.customer, ...response.customers];
            const uniqueArray = mergeArray.reduce((acc: any, obj: any) => {
                const existingObj = acc.find((item: any) => item.id === obj.id);

                if (!existingObj) {
                    acc.push(obj);
                }

                return acc;
            }, []);
           
            const data = {
                customers: uniqueArray,
                invoice: response.invoice,
                invoice_tests: response.invoice_tests,
                payment_mode_choices: response.payment_mode_choices,
                sales_mode: response.sales_mode,
                taxs: response.taxs
            }
            console.log('✌️data --->', data);
            setFormData(prevState => ({
                ...prevState,
                customer: uniqueArray[0].id,
                sales_mode: response?.sales_mode[0].id,
                project_name: response.invoice.project_name,
                discount: response.invoice.discount,
                tax: response?.taxs[0]?.id,
                advance: response.invoice.advance,
                date: response.invoice.date,
                payment_mode: response.invoice.payment_mode,
                cheque_number: response.invoice.cheque_number,
                bank: response.invoice.bank,
                place_of_testing: response.place_of_testing,
                amount_paid_date: response.invoice.amount_paid_date,
                before_tax: response?.invoice_tests.reduce((total: any, test: any) => total + parseFloat(test.total), 0),

            }));

            setBeforeTotalTax(response?.invoice_tests.reduce((total: any, test: any) => total + parseFloat(test.total), 0))

            const Balance = afterTax - parseFloat(response.invoice.advance);
            setBalance(Balance.toString());

            setInvoiceFormData(data)

            setCustomerAddress(uniqueArray[0]?.address1);

            setTax(response?.taxs[0]?.tax_name)

            setTaxPercentage(response?.taxs[0]?.tax_percentage)

            const beforetax: any = response?.invoice_tests.reduce((total: any, test: any) => total + parseFloat(test.total), 0)
            const tagPercentage: any = response?.taxs[0]?.tax_percentage
            const calculatedtax: any = beforetax * tagPercentage / 100
            setTaxCalculated(calculatedtax)

            const afterCalculated = beforetax + calculatedtax
            setAfterTax(afterCalculated)

            const InitialBalance: any = afterCalculated - response.invoice.advance
            setBalance(InitialBalance)

            setAdvance(response.invoice.advance)

        }).catch((error: any) => {
            console.log("error", error)
        })
    }
    // Get Single Product
    useEffect(() => {
        getInvoiceTestData()
    }, [id])

    // console.log("InvoiceFormData", invoiceFormData)

    // get meterial test
    useEffect(() => {

        const Token = localStorage.getItem('token');
        axios.get("http://files.covaiciviltechlab.com/get_material_test/", {
            headers: {
                'Authorization': `Token ${Token}`
            }
        }).then((res) => {
            setTestFormData(res.data)
        }).catch((error: any) => {
            console.log(error)
        })
    }, [])
    // console.log("testFormData", testFormData)

    // modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
    };


    // Multiple Select
    const TestChange = (testIds: string[]) => {

        const filteredTests = filterMaterial.filter((value: any) => {
            return testIds.includes(value.value);
        });
        const addedPrice: any = filteredTests.map((obj: any) => ({ ...obj, quantity: 1, total: Number(obj?.price) }));

        setFilterTest(addedPrice);
    };




    const materialChange = (materialId: any) => {
        const filteredMaterial = testFormData?.tests
            ?.filter((test: any) => test.test_material_id === String(materialId))
            .map((test: any) => ({
                label: test.test_name,
                value: test.id,
                price: test.price_per_piece
            })) ?? [];
        setFilterMaterial(filteredMaterial);
        // console.log("filteredMaterial", filteredMaterial);
    };


    // console.log("FilterMaterial", filterMaterial)



    // const removeItem = (item: any = null) => {
    //     setItems(items.filter((d: any) => d.id !== item.id));
    // };


    // console.log("invoiceFormData", invoiceFormData)
    const onFinish = (values: any) => {
        // console.log('✌️values --->', values);
        // Assuming 'id' and 'filterTest' are properties you want to include in the request
        values.invoice = Number(id);

        // const requestData = { ...values };

        // console.log("filterTest", filterTest)
        const body: any = {
            ...values,
            tests: filterTest.map((item: any) => ({
                ...values,
                test: item?.value,
                quantity: item.quantity,
                price_per_sample: Number(item.price),
                total: Number(item.total.toFixed(2))
            }))
        }

        // console.log('✌️body --->', body);

        axios.post('http://files.covaiciviltechlab.com/create_invoice_test/', body?.tests, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                console.log(res.data);
                setIsModalOpen(false);
                getInvoiceTestData()
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };



    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
    };



    // console.log("filterDAtss", filterTest)

    const quantityChange = ((e: any, index: number) => {
        // console.log('✌️e --->', e, index);
        const updatedFilterTest: any = [...filterTest]; // Create a copy of the array
        const filterItem: any = updatedFilterTest[index];

        if (filterItem) {
            // Check if the item at the specified index exists
            const updatedItem = {
                ...filterItem,
                quantity: Number(e),
                total: Number(e) * Number(filterItem.price),
            };
            updatedFilterTest[index] = updatedItem;
            setFilterTest(updatedFilterTest)

        }
    })


    const priceChange = ((e: any, index: number) => {
        // console.log('✌️e --->', e, index);
        const updatedFilterTest: any = [...filterTest]; // Create a copy of the array
        const filterItem: any = updatedFilterTest[index];

        if (filterItem) {
            // Check if the item at the specified index exists
            const updatedItem = {
                ...filterItem,
                price: Number(e),
                total: Number(e) * Number(filterItem.quantity),
            };
            updatedFilterTest[index] = updatedItem;
            setFilterTest(updatedFilterTest)

        }
    })



    const invoiceFormSubmit = ((e: any) => {
        console.log('FormData', formData, id)

        // let config = {
        //     method: 'put',
        //     maxBodyLength: Infinity,
        //     url: `http://files.covaiciviltechlab.com/edit_invoice//`,
        //     headers: {
        //         'Authorization': 'Token b8a733d32b22d10e077fde4dce188adb9e981231',
        //         'Content-Type': 'application/json'
        //     },
        //     data: formData
        // };

        const Token = localStorage.getItem('token');

        axios.put(`http://files.covaiciviltechlab.com/edit_invoice/${id}/`, {
            ...formData,   // Assuming formData is an object
            advance: advance,
            balance: balance,
        }, {
            headers: {
                'Authorization': `Token ${Token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });

        // let data = JSON.stringify({
        //     "customer": 3,
        //     "sales_mode": 1,
        //     "project_name": "Project 2",
        //     "discount": 12,
        //     "tax": 1,
        //     "advance": 10,
        //     "date": "2023-12-05",
        //     "payment_mode": "cheque",
        //     "cheque_number": "!111",
        //     "bank": "canara",
        //     "amount_paid_date": "2023-12-04"
        //   });
        // axios.put(`http://files.covaiciviltechlab.com/edit_invoice/${id}`, data).then((res) => {
        //     console.log(res.data)
        // }).catch((error: any) => {
        //     console.error('Error:', error);
        // })

        // e.preventDefault()
        // console.log("formData", formData)
    })


    const handleSelectChange = (e: any) => {

        // Find the selected customer in the data array
        const selectedCustomer = invoiceFormData?.customers?.find((customer: any) => customer.id == Number(e.target.value));

        setCustomerAddress(selectedCustomer?.address1 || '');
        setFormData(prevState => ({
            ...prevState,
            customer: selectedCustomer.id

        }));

        // console.log('customerAddress', customerAddress);

        // Update form values directly (assuming you have access to the form instance)
        form.setFieldsValue({
            'reciever-address': selectedCustomer?.address1 || '',
        });
    };

    const handleTaxChange = (e: any) => {
        const selectedTax = invoiceFormData?.taxs?.find((tax: any) => tax.id === Number(e.target.value));
      
        setTax(selectedTax?.tax_name || '');
        setTaxPercentage(selectedTax?.tax_percentage || '');

        setFormData((prevState) => ({
            ...prevState,
            tax: selectedTax,
        }));

        const taxCalculation: any = (parseFloat(selectedTax?.tax_percentage || '0') * parseFloat(formData?.before_tax || '0')) / 100;
        const After_tax = parseFloat(formData?.before_tax || '0') + taxCalculation;
        const newBalance = After_tax - parseFloat(formData.advance || '0');

        setBalance(newBalance.toString());
        setTaxCalculated(taxCalculation);
        setAfterTax(After_tax);
    };


    const handleAdvanceChange = (value: string) => {
        const newAdvance = parseFloat(value) || 0;
        setAdvance(newAdvance);
        const newBalance = afterTax - newAdvance;
        setBalance(newBalance.toString());
    };


    const handleDiscountChange = (e: any) => {

        const discount = parseFloat(e) || 0;
        const beforeTax = parseFloat(beforeTotalTax || '0');


        // Calculate discounted amount and discountedBeforeTax
        const discountedAmount = (beforeTax * discount) / 100;
        const discountedBeforeTax = discount !== 0 ? beforeTax - discountedAmount : beforeTax;

        // Calculate tax, After_tax, and newBalance
        const taxCalculation: any = (parseFloat(taxPercentage) * discountedBeforeTax) / 100;
        const After_tax = discountedBeforeTax + taxCalculation;
        const newBalance = After_tax - parseFloat(formData.advance || '0');

        // Update form data and state values

        if (discount === 0) {
            setFormData((prevState: any) => ({
                ...prevState,
                discount: discount,
                before_tax: beforeTotalTax || '0', // Set your desired initial value
            }));
        } else {
            setFormData((prevState: any) => ({
                ...prevState,
                discount: discount,
                before_tax: discountedBeforeTax.toString(),
            }));
        }
        setBalance(newBalance.toString());
        setTaxCalculated(taxCalculation);
        setAfterTax(After_tax);
    };

    const handlePreviewClick = (id: any) => {
        // Navigate to the /invoice/edit page with the record data as a query parameter
        window.location.href = `/invoice/preview?id=${id}`;
    };

    console.log("textextex", tax)

    // drawer
    // drawer
    const showDrawer = (item: any) => {
        setEditRecord(item);
        form.setFieldsValue(item);
        setOpen(true);

    };

    const onClose = () => {
        setOpen(false);
        form.resetFields()
        setCustomerAddress('')
    };


    // Invoice Test Delete 
    const handleDelete = (id: any,) => {

        const Token = localStorage.getItem("token")

        Modal.confirm({
            title: "Are you sure, you want to delete this TAX record?",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                console.log(id, "values")
                axios.delete(`http://files.covaiciviltechlab.com/delete_invoice_test/${id}`, {
                    headers: {
                        "Authorization": `Token ${Token}`
                    }
                }).then((res) => {
                    console.log(res)
                    getInvoiceTestData()
                }).catch((err) => {
                    console.log(err)
                })

            },
        });
    };

    // invoice edit form onfinish
    const onFinish2 = (values: any,) => {
        console.log('Success:', editRecord, values);


        const Token = localStorage.getItem("token")
        console.log("TokenTokenTokenToken", Token)

        axios.put(`http://files.covaiciviltechlab.com/edit_invoice_test/${editRecord.id}/`, values, {
            headers: {
                "Authorization": `Token ${Token}`
            }
        }).then((res: any) => {
            getInvoiceTestData()
            console.log(res);
            setOpen(false);
        }).catch((error: any) => {
            console.log(error);
        });
        onClose();
    }


    const onFinishFailed2 = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleQuantityChange = (value: any) => {
        const pricePerSample = form.getFieldValue('price_per_sample') || 0;
        form.setFieldsValue({
            total: value * pricePerSample,
        });
    };

    const handlePricePerSampleChange = (value: any) => {
        const quantity = form.getFieldValue('quantity') || 0;
        form.setFieldsValue({
            total: value * quantity,
        });
    };

    // invoice test Edit
    // const handleEditClick = (item: any) => {
    //     // Handle the edit click for the specific ID (item.id)
    //     console.log(`Edit clicked for ID: ${item}`);
    //     // Add your logic here, for example, open a modal for editing
    // };


    // Print
    const handlePrint = (item: any) => {
        // Navigate to the /invoice/edit page with the record data as a query parameter
        window.location.href = `/invoice/invoiceReport?id=${item.id}`;
    };
    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                <div className="flex flex-wrap justify-between px-4">
                    <div className="mb-6 w-full lg:w-1/2">
                        <div className="flex shrink-0 items-center text-black dark:text-white">
                            <img src="/assets/images/civil-techno-logo.png" alt="img" style={{ width: "30%" }} />
                        </div>
                        <div className="mt-6 space-y-1 text-gray-500 dark:text-gray-400">
                        <div className="mt-4 flex items-center">
                            <label htmlFor="place_of_testing" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Place of testing
                            </label>
                            <input id="place_of_testing" type="text" className="form-input w-2/3 lg:w-[250px]" name="place_of_testing" value={formData.place_of_testing} onChange={inputChange} />
                        </div>
                           
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 lg:max-w-fit">
                        <div className="flex items-center">
                            <label htmlFor="number" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Invoice Number
                            </label>
                            <input id="number" type="text" className="form-input w-2/3 lg:w-[250px]" name="invoice_no" defaultValue={invoiceFormData?.invoice?.invoice_no} />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="startDate" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Invoice Date
                            </label>
                            <input id="startDate" type="date" className="form-input w-2/3 lg:w-[250px]" name="date" value={formData.date} onChange={inputChange} />
                        </div>
                      
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="mt-8 px-4">
                    <div className="flex flex-col justify-between lg:flex-row">
                        <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                            <div className="text-lg">Bill To :-</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Customer Name
                                </label>
                                <select id="country" className="form-select flex-1" name="customer" onChange={handleSelectChange}

                                >

                                    {invoiceFormData?.customers?.map((value: any) => (
                                        <option key={value.id} value={value.id}>
                                            {value?.customer_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-address" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Address
                                </label>
                                <textarea id="reciever-address" name="reciever-address" className="form-input flex-1" value={customerAddress} placeholder="Enter Address" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Project Name
                                </label>
                                <input id="reciever-email" type="email" className="form-input flex-1" name="project_name" value={formData?.project_name} onChange={inputChange} placeholder="Enter Email" />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="text-lg"></div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Amount Paid Date
                                </label>
                                <input id="swift-code" type="date" className="form-input flex-1" name="amount_paid_date" value={formData?.amount_paid_date} onChange={inputChange} placeholder="Enter SWIFT Number" />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Payment Mode
                                </label>
                                <select id="country" className="form-select flex-1" name="payment_mode" value={formData?.payment_mode} onChange={inputChange} >
                                    {
                                        invoiceFormData?.payment_mode_choices?.map((value: any) => {
                                            // console.log("valuevaluevalue", value)
                                            return (
                                                <option key={value.id} value={value.id}>{value.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>


                            <div className="mt-4 flex items-center">
                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Sales Mode
                                </label>
                                <select id="country" name="sales_mode" value={formData?.sales_mode} onChange={inputChange} className="form-select flex-1">
                                    {
                                        invoiceFormData?.sales_mode?.map((value: any) => {
                                            // console.log("valuevaluevalue", value)
                                            return (
                                                <option key={value.id} value={value.id}>{value.sales_mode}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Test Name</th>
                                    <th>Quantity</th>
                                    <th >Price</th>
                                    <th>Total</th>
                                    <th >Action</th>
                                    <th >Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceFormData.invoice_tests?.length <= 0 && (
                                    <tr>
                                        <td colSpan={5} className="!text-center font-semibold">
                                            No Item Available
                                        </td>
                                    </tr>
                                )}
                                {invoiceFormData.invoice_tests?.map((item: any, index: any) => {
                                    return (
                                        <tr className="align-top" key={item.id}>
                                            <td>{item.test_name}</td>
                                            <td>{Number(item?.quantity)}</td>
                                            <td>  {Number(item?.price_per_sample)} </td>
                                            <td>{item.quantity * item.price_per_sample}</td>
                                            <td>
                                                <Space>
                                                    <EditOutlined rev={undefined} className='edit-icon' onClick={() => showDrawer(item)} />
                                                    <DeleteOutlined rev={undefined} style={{ color: "red", cursor: "pointer" }} className='delete-icon' onClick={() => handleDelete(item?.id)} />
                                                </Space>
                                            </td>
                                            <td>
                                                <PrinterOutlined rev={undefined} className='edit-icon' onClick={() => handlePrint(item)}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                        <div className="mb-6 sm:mb-0">
                            <button type="button" className="btn btn-primary" onClick={showModal}>
                                Add Invoice Test
                            </button>
                        </div>
                        <div className="sm:w-2/5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Discount
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="discount" value={formData?.discount} onChange={(e) => handleDiscountChange(e.target.value)} placeholder="Enter Discount" />
                                {/* <div>Subtotal</div>
                                <div>265.00</div> */}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Before Tax
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="before_tax" value={formData?.before_tax} onChange={inputChange} placeholder="Enter Before Tax" disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-between">

                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Tax
                                </label>
                                {
                                    <select id="country" name="tax" value={formData?.tax} className="form-select flex-1" onChange={handleTaxChange} multiple>

                                    {
                                        invoiceFormData?.taxs?.map((value: any) => {
                                            // console.log("valuevaluevalue", value)
                                            return (
                                                <option key={value.id} value={value.id}>{value.tax_name}</option>
                                            )
                                        })
                                    }
                                </select> }
                                
                          

                            </div>
                            <div className="flex items-center justify-between" style={{ marginTop: "20px" }}>
                                <div>{tax}</div>
                                <div>{tax} :{taxPercentage}% = {taxCalculated}</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    After Tax
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="after_tax" value={afterTax} onChange={inputChange} placeholder="Enter After Tax" disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Advance
                                </label>
                                <input id="swift-code" type="text" className="form-input flex-1" name="advance" value={advance}
                                    onChange={(e) => handleAdvanceChange(e.target.value)} placeholder="Enter SWIFT Number" />
                            </div>
                            <div className="mt-4 flex items-center justify-between font-semibold">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Balance
                                </label>
                                <input id="swift-code" type="text" className="form-input flex-1" name="balance" value={balance} onChange={inputChange} placeholder="Enter SWIFT Number" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="mt-8 px-4">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" className="form-textarea min-h-[130px]" placeholder="Notes...." defaultValue={params.notes}></textarea>
                </div> */}
            </div>
            <div className="mt-6 w-full xl:mt-0 xl:w-96">
                {/* <div className="panel mb-5">
                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" className="form-select" value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                        {currencyList.map((currency, i) => (
                            <option value={currency} key={i}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    <div className="mt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="tax">Tax(%) </label>
                                <input id="tax" type="number" name="tax" className="form-input" placeholder="Tax" value={tax} onChange={(e) => setTax(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="discount">Discount(%) </label>
                                <input id="discount" type="number" name="discount" className="form-input" placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="shipping-charge">Shipping Charge($) </label>
                        <input
                            id="shipping-charge"
                            type="number"
                            name="shipping-charge"
                            className="form-input"
                            placeholder="Shipping Charge"
                            value={shippingCharge}
                            onChange={(e) => setShippingCharge(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="payment-method">Accept Payment Via</label>
                        <select id="payment-method" name="payment-method" className="form-select" defaultValue={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value=" ">Select Payment</option>
                            <option value="bank">Bank Account</option>
                            <option value="paypal">Paypal</option>
                            <option value="upi">UPI Transfer</option>
                        </select>
                    </div>
                </div> */}
                <div className="panel">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                        <button type="button" className="btn btn-success w-full gap-2" onClick={invoiceFormSubmit}>
                            <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Save
                        </button>

                        <button type="button" className="btn btn-info w-full gap-2">
                            <IconSend className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Send Invoice
                        </button>

                        <button className="btn btn-primary w-full gap-2" onClick={() => handlePreviewClick(id)}>
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Preview
                        </button>

                    </div>
                </div>
            </div>



            {/* Modal */}
            <Modal title="Create Invoice" open={isModalOpen} width={900} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <Form
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item
                        label="Material ID"
                        name="material_id"
                        required={false}
                        rules={[{ required: true, message: 'Please select a Material ID!' }]}
                    >
                        <Select onChange={materialChange}>
                            {testFormData?.materials?.map((value: any) => (
                                <Select.Option key={value.id} value={value.id}>
                                    {value.material_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Test"
                        name="test"
                        required={false}
                        rules={[{ required: true, message: 'Please select one or more tests!' }]}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select one or more tests"
                            onChange={TestChange}
                            optionLabelProp="label"
                            options={filterMaterial}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button style={{ color: "blue", borderColor: "blue", marginTop: "20px" }} onClick={tableTogle}>
                            {tableVisible ? "Hide Info" : "Get Info"}
                        </Button>

                    </Form.Item>


                    {
                        tableVisible && (
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Test Name</th>
                                            <th className="w-1">Quantity</th>
                                            <th className="w-1">Price Per Sample</th>
                                            <th>Total</th>
                                            <th className="w-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterTest.length <= 0 && (
                                            <tr>
                                                <td colSpan={5} className="!text-center font-semibold">
                                                    No Item Available
                                                </td>
                                            </tr>
                                        )}
                                        {filterTest.map((item: any, index: any) => {
                                            return (
                                                <tr className="align-top" key={item.value}>
                                                    <td>

                                                        <input type="text" className="form-input min-w-[200px]" placeholder="Enter Item Name" defaultValue={item?.label} />
                                                        {/* <textarea className="form-textarea mt-4" placeholder="Enter Description" defaultValue={item.description}></textarea> */}

                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-input w-32"
                                                            placeholder="Quantity"
                                                            value={Number(item?.quantity)}
                                                            min={0}
                                                            onChange={(e) => quantityChange(e.target.value, index)}
                                                        />

                                                    </td>
                                                    <td>
                                                        <input
                                                            type="float"
                                                            className="form-input w-32"
                                                            placeholder="Price"
                                                            min={0}
                                                            onChange={(e) => priceChange(e.target.value, index)}
                                                            value={Number(item?.price)}
                                                        />
                                                    </td>
                                                    <td>{item?.quantity * Number(item.price)}</td>
                                                    {/* <td>
                                                        <button type="button" onClick={() => removeItem(item)}>
                                                            <IconX className="w-5 h-5" />
                                                        </button>
                                                    </td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }


                    <div style={{ paddingTop: "30px" }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>



            {/* INvoice Edit Drawer */}
            <Drawer title="Edit Invoice" placement="right" width={600} onClose={onClose} open={open}>
                <Form
                    name="basic"
                    layout="vertical"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={onFinish2}
                    onFinishFailed={onFinishFailed2}
                    autoComplete="off"

                >
                    <Form.Item
                        label="Test Name"
                        name="test_name"
                        required={false}
                        rules={[{ required: true, message: 'Please input your Test Name!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        required={false}
                        rules={[{ required: true, message: 'Please input your Quantity!' }]}
                    >
                        <Input onChange={(e) => handleQuantityChange(e.target.value)} />
                    </Form.Item>

                    <Form.Item label="Price Per Sample" name="price_per_sample"
                        required={false}
                        rules={[{ required: true, message: 'Please input your Tax Status!' }]}

                    >
                        <Input onChange={(e) => handlePricePerSampleChange(e.target.value)} />
                    </Form.Item>

                    <Form.Item label="Total" name="total"
                        required={false}
                    // rules={[{ required: true, message: 'Please input your !' }]}
                    >
                        <Input disabled />
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

        </div>
    );
};

export default Edit;
