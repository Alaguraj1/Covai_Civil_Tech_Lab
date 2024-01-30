import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconEye from '@/components/Icon/IconEye';
import axios from 'axios';
import { useRouter } from 'next/router';
import {PrinterOutlined } from '@ant-design/icons';

const View = () => {

    const router = useRouter();
    const { id } = router.query;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoice Edit'));
    });

    const [invoiceFormData, setInvoiceFormData] = useState<any>({})
    const [customerAddress, setCustomerAddress] = useState('');
    const [balance, setBalance] = useState<any>('')
    const [afterTax, setAfterTax] = useState<any>('')
    const [advance, setAdvance] = useState(0)
    const [checkedItems, setCheckedItems] = useState<any>({});
    const [totalTaxPercentage, setTotalTaxPercentage] = useState(0);
    const [updateBeforeTax, setUpdateBeforeTax] = useState(0);
    const [formData, setFormData] = useState<any>({
        customer: "",
        cheque_number: "",
        project_name: "",
        upi: "",
        discount: "",
        advance: "",
        date: "",
        payment_mode: "",
        bank: "",
        amount_paid_date: "",
        before_tax: "",
        tax: [],
        completed: ""
    });



    const formatTotal = () => {

        const selectedPercentages = invoiceFormData?.taxs?.filter(
            (item: any) => checkedItems[item.id]
        );

        if (selectedPercentages?.length > 0) {
            const percentagesArray = selectedPercentages.map((item: any) =>
                parseFloat(item.tax_percentage)
            );
            const selectedName = selectedPercentages.map((item: any) =>
                (item.tax_name)
            );
            const nameString = selectedName.join(" + ");

            const percentagesString = percentagesArray.join(" + ");
            return `${nameString} : ${percentagesString} = ${totalTaxPercentage}`;
        }
        return "";
    };


    // Get Single Product
    useEffect(() => {
        getInvoiceTestData()
    }, [id])



    const getInvoiceTestData = () => {
        axios.get(`http://files.covaiciviltechlab.com/edit_invoice/${id}/`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log('✌️res --->', res);
            let response = res.data;


            // console.log('✌️responsedatedate --->', response);
            let mergeArray: any = [response.customer, ...response.customers];
            const uniqueArray = mergeArray.reduce((acc: any, obj: any) => {
                const existingObj = acc.find((item: any) => item.id === obj.id);

                if (!existingObj) {
                    acc.push(obj);
                }

                return acc;
            }, []);

            const data:any = {
                customers: uniqueArray,
                invoice: response.invoice,
                invoice_tests: response.invoice_tests,
                payment_mode_choices: response.payment_mode_choices,
                sales_mode: response.sales_mode,
                taxs: response.taxs,
                payments: response.payments
            }
            console.log('✌️data --->', data);

            // if (update) {
            const convertedObj: any = {}

            data?.taxs.forEach((item: any) => {
                convertedObj[item.id] = data?.invoice?.tax.includes(item.id);
            });

            setCheckedItems(convertedObj);


            //Before tax
            const beforetax: any = response?.invoice_tests.reduce((total: any, test: any) => total + parseFloat(test.total), 0)
            const discountedAmount = (beforetax * response.invoice.discount) / 100;
            const discountedBeforeTax = response.invoice.discount !== 0 ? beforetax - discountedAmount : beforetax;
            setUpdateBeforeTax(discountedBeforeTax)
            // -------------------------------------------------------------------------------------------
            // Tax total prrcentage
            const matchedTaxs = data?.taxs.filter((item: any) => data?.invoice?.tax.includes(item.id));
            const sumPercentage = matchedTaxs.reduce((sum: any, item: any) => {
                return sum + parseFloat(item.tax_percentage);
            }, 0);

            const sumAsNumber = Number(sumPercentage);
            const totalPer: any = sumAsNumber * discountedBeforeTax / 100
            setTotalTaxPercentage(parseInt(totalPer, 10))

            // -------------------------------------------------------------------------------------------
            //After tax
            const After_tax = discountedBeforeTax + totalPer;
            setAfterTax(parseInt(After_tax, 10))
            // -------------------------------------------------------------------------------------------

            setFormData((prevState: any) => ({
                ...prevState,
                customer: uniqueArray[0].id,
                project_name: response.invoice.project_name,
                discount: response.invoice.discount,
                advance: response.invoice.advance,
                date: response.invoice.date,
                payment_mode: response.invoice.payment_mode,
                cheque_number: response.invoice.cheque_number,
                bank: response.invoice.bank,
                place_of_testing: response.invoice.place_of_testing,
                amount_paid_date: response.invoice.amount_paid_date,
                before_tax: parseInt(discountedBeforeTax, 10) || 0,
                invoice_tests: response?.invoice_tests,
                upi: response.invoice.upi,
                completed: response.invoice.completed
            }));
            console.log("response.invoice.completed", response.invoice.completed)

    
            setInvoiceFormData(data)
            setCustomerAddress(uniqueArray[0]?.address1);


            const totalAmount = response.payments.reduce((accumulator: any, current: any) => {
                const amountValue = parseFloat(current.amount);

                return accumulator + amountValue;
            }, 0);

            setAdvance(totalAmount)

            const InitialBalance: any = After_tax - totalAmount
            setBalance(parseInt(InitialBalance, 10))
            console.log('✌️totalAmount --->', totalAmount);


        }).catch((error: any) => {
            console.log("error", error)
        })
    }



    useEffect(() => {
        formatTotal()
    }, [updateBeforeTax, totalTaxPercentage])



    const handlePreviewClick = (id: any) => {
        var id: any = id;
        var url = `/invoice/preview?id=${id}`;
      window.open(url, '_blank');
    };



    // Print
    const handlePrint = (item: any) => {
        const id = item.id;
        const ref = `/invoice/print/?id=${id}`;
        window.open(ref, "_blank"); // Note: "_blank" specifies a new tab or window
      };
      
    return (
        <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="panel flex-1 px-0 py-6 rtl:xl:ml-6">
                <div className="mt-8 px-4">
                    <div className="flex flex-col justify-between lg:flex-row">
                        <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                            <div className="text-lg">Bill To :-</div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Customer Name
                                </label>
                                <select id="country" className="form-select flex-1" name="customer" disabled

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
                                <textarea id="reciever-address" name="reciever-address" className="form-input flex-1" value={customerAddress} placeholder="Enter Address" disabled/>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="reciever-email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Project Name
                                </label>
                                <input id="reciever-email" type="email" className="form-input flex-1" name="project_name" value={formData?.project_name} placeholder="Enter Email" disabled/>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="text-lg"></div>

                            <div className="mt-4 flex items-center">
                                <label htmlFor="number" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Invoice Number
                                </label>
                                <input id="number" type="text" className="form-input flex-1" name="invoice_no" defaultValue={invoiceFormData?.invoice?.invoice_no} disabled />
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="startDate" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Invoice Date
                                </label>
                                <input id="startDate" type="date" className="form-input flex-1" name="date" value={formData.date} disabled/>
                            </div>
                            <div className="mt-4 flex items-center">
                                <label htmlFor="place_of_testing" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Place of testing
                                </label>
                                <input id="place_of_testing" type="text" className="form-input flex-1" name="place_of_testing" value={formData.place_of_testing} disabled/>
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
                                    <th>Completed</th>
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
                                {invoiceFormData?.invoice_tests?.map((item: any, index: any) => {
                                    return (
                                        <tr className="align-top" key={item.id}>
                                            <td>{item.test_name}</td>
                                            <td>{Number(item?.quantity)}</td>
                                            <td>  {Number(item?.price_per_sample)} </td>
                                            <td>{item.quantity * item.price_per_sample}</td>
                                            <td>{item?.completed}</td>
                                            <td>
                                                <PrinterOutlined rev={undefined} className='edit-icon' onClick={() => handlePrint(item)} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="mt-8">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Payment Mode</th>
                                    <th>Cheque Number</th>
                                    <th>UPI</th>
                                    <th>Amount</th>
                                    <th>Amount Paid Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceFormData.payments?.length <= 0 && (
                                    <tr>
                                        <td colSpan={5} className="!text-center font-semibold">
                                            No Item Available
                                        </td>
                                    </tr>
                                )}
                                {invoiceFormData.payments?.map((item: any, index: any) => {
                                    return (
                                        <tr className="align-top" key={item.id}>
                                            <td>{item?.payment_mode}</td>
                                            <td>{item?.cheque_number}</td>
                                            <td>{item?.upi} </td>
                                            <td>{item?.amount}</td>
                                            <td>{item?.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                        <div className="mb-6 sm:mb-0">
                        </div>
                        <div className="sm:w-2/5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Discount (%)
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="discount" value={formData?.discount} placeholder="Enter Discount" disabled/>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Before Tax
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="before_tax" value={formData?.before_tax} placeholder="Enter Before Tax" disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-between">

                                <label htmlFor="country" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Tax
                                </label>

                                {invoiceFormData?.taxs?.map((item: any) => {

                                    return (
                                        <div key={item.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={item.tax_name}
                                                    checked={checkedItems[item.id]}
                                                   
                                                    style={{ marginRight: "5px" }}
                                                />
                                                {item.tax_name}
                                            </label>
                                        </div>


                                    )
                                })}

                            </div>
                            <div className="flex items-center justify-between" style={{ marginTop: "20px" }}>
                                {formatTotal() && <p> {formatTotal()}</p>}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    After Tax
                                </label>
                                <input id="bank-name" type="text" className="form-input flex-1" name="after_tax" value={afterTax} placeholder="Enter After Tax" disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Advance
                                </label>
                                <input id="swift-code" type="text" className="form-input flex-1" name="advance" value={advance}
                                    disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-between font-semibold">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Balance
                                </label>
                                <input id="swift-code" type="text" className="form-input flex-1" name="balance" value={balance} disabled />
                            </div>
                            <div className="mt-4 flex items-center justify-start font-semibold">
                                <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                    Completed
                                </label>
                                <label style={{ marginRight: "3px", marginBottom: "0px" }}>Yes</label>
                                <input
                                    id="swift-code-yes"
                                    type="radio"
                                    style={{ marginRight: "20px" }}
                                    name="completed"
                                    value="Yes"
                                    checked={formData.completed === "Yes"}
                                />
                                <label style={{ marginRight: "3px", marginBottom: "0px" }}>No</label>
                                <input
                                    id="swift-code-no"
                                    type="radio"
                                    name="completed"
                                    value="No"
                                    checked={formData.completed === "No"}
                                />
                            </div>

                            <div style={{ marginTop: "50px" }}>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1" style={{ display: "flex" }}>

                                    {/* {
                                        admin == "false" && editGetData?.invoice?.completed == "Yes" ? (
                                            <button
                                                type="button"
                                                className="btn btn-civil w-full gap-2"
                                            >
                                                <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                Show
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-civil w-full gap-2"
                                                onClick={invoiceFormSubmit}
                                            >
                                                <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                                Update
                                            </button>
                                        )
                                    } */}


                                    {/* <button type="button" className="btn btn-civil w-full gap-2" onClick={invoiceFormSubmit}>
                                        <IconSave className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                        Update
                                    </button> */}

                                    <button className="btn btn-civil w-full gap-2" onClick={() => handlePreviewClick(id)}>
                                        <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;
