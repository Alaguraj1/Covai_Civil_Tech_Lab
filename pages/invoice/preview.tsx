import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { displayName } from 'react-quill';

const Preview = () => {
  const [wordAmt, setWordAmt] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const [printData, setPrintData] = useState<any>([])

  useEffect(() => {
    calcAmt();
  }, []);

  const toWords = (amount: any) => {
    return `Words for ${amount}`;
  };

  const calcAmt = () => {
    const amt = "11,446.00"; // You can replace this with your actual data source
    const upperto = toWords(amt);
    const word = upperto.slice(0, 1).toUpperCase() + upperto.slice(1);
    setWordAmt(word);
  };


  useEffect(() => {
    axios.get(`http://files.covaiciviltechlab.com/print_invoice/${id}/`, {
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    }).then((res) => {
      setPrintData(res?.data)
    }).catch((error: any) => {
      console.log(error)
    })
  }, [id])


  console.log("printData", printData)

  const invoiceTests = printData.invoice_tests || [];
  const totalAmount = invoiceTests.reduce((acc: any, invoiceTest: any) => {
    return acc + parseFloat(invoiceTest.total);
  }, 0);
  console.log('Total Amount:', totalAmount);


  const TaxData: any = totalAmount * 9 / 100
  console.log('TaxData --->', TaxData);


  const invoiceTestsTotal = invoiceTests.reduce((acc: any, item: any) => acc + parseFloat(item.total), 0);

  // Assuming TaxData is a single numeric value
  const taxDataValue = parseFloat(TaxData);

  // Combine the totals and log the result
  const TotalData = invoiceTestsTotal + taxDataValue + taxDataValue;
  console.log('✌️TotalData --->', TotalData);

  return (
    <>
      <div>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              "\n.style3 {\n\tfont-size: 22px;\n\tfont-weight: bold;\n}\n\ntable td, th {\n\tfont-size: 13px;\n}\n"
          }}
        />
        <div className="container">
          <div className="panel">
            <div className="flex justify-between flex-wrap gap-4 px-4 grid-cols-3">
              <div className="text-3xl font-semibold uppercase">Invoice</div>
              <div className="ltr:text-right rtl:text-left px-7 grid-cols-9">
                <div className="shrink-0">
                  <img src="/assets/images/logo-in.png" alt="img" className="w-17 ltr:ml-auto rtl:mr-auto" />
                </div>
                <div className="space-y-1 mt-0 text-white-dark text-right">
                  <div>
                    <b>AN ISO 9001:2008 CERTIFIED LAB</b><br></br>
                    411/4, Ballu Naidu Thottam,Vijayalakshmi Nagar,<br></br>
                    Neelikonampalayam Po, Coimbatore - 6410333.<br></br>

                    <b>GSTIN : 22AAAAA0000A1Z5</b>


                  </div>

                </div>
              </div>

            </div>

            <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
            <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap text-sm">
              <div className="flex-1">
                <div className="space-y-1 text-white-dark">
                  <div>Issue For:</div>
                  <div className="text-black dark:text-white font-semibold">
                    {printData?.customer?.address1}
                    <br></br>
                    <div className="space-y-1 text-white-dark">
                      -Original for Receipient<br></br>
                      -Duplicate for Supplier Transporter<br></br>
                      -Triplicate for Supplier
                    </div>

                  </div>

                </div>
              </div>
              <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
                <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Bill No :</div>
                    <div> {printData?.invoice?.invoice_no}</div>
                  </div>
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Issue Date :</div>
                    <div>{printData?.invoice?.date}</div>
                  </div>

                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Project Name :</div>
                    <div>{printData?.invoice?.project_name}</div>
                  </div>
                  <div className="flex items-center w-full justify-between">
                    <div className="text-white-dark">Place of Testing  :</div>
                    <div>{printData?.customer?.place_of_testing}</div>
                  </div>
                  <div className="flex items-center w-full justify-between">
                    <div className="text-white-dark"> GSTIN/UIN  :</div>
                    <div>{printData?.customer?.gstin_no}</div>
                  </div>
                </div>


                <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Bank Name:</div>
                    <div className="whitespace-nowrap">State Bank Of India</div>
                  </div>
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Account Number:</div>
                    <div>62371331494</div>
                  </div>
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">Branch:</div>
                    <div>KALAPATTI</div>
                  </div>
                  <div className="flex items-center w-full justify-between mb-2">
                    <div className="text-white-dark">IFSC Code:</div>
                    <div>SBIN0021798</div>
                  </div>

                </div>


              </div>
            </div>

            {/*header end */}

            {/*table data information */}
            {/*table data information end */}

            <div className="table-responsive mt-6 invoice-table">
              <table className="table-striped">
                <thead>
                  <tr>
                    <th >S.No</th>
                    <th>Name of Test</th>
                    <th>HAN/SAC</th>
                    <th>Qty</th>
                    <th style={{ textAlign: "right" }}>Rate/Sample(INR)</th>
                    <th style={{ textAlign: "right" }}>Amount(INR)</th>
                  </tr>
                </thead>
<tbody>
                {
                  printData?.invoice_tests?.map((invoice: any) => {
                    return (
                      <>
                        <tr>
                          <td>{invoice?.id}</td>
                          <td>{invoice?.test_name} - <span style={{ fontWeight: "bold" }}>{invoice?.material_name}</span></td>
                          <td>998346</td>
                          <td >{invoice?.qty}</td>
                          <td style={{ textAlign: "right" }}>{invoice?.price_per_sample}</td>
                          <td style={{ textAlign: "right" }}>{invoice?.total}</td>
                        </tr>

                      </>
                    )
                  })

                }

                <tr>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>

                  <td style={{ textAlign: "right" }}><b> GST :18%</b></td>
                  <td> </td>
                </tr>
                <tr>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td style={{ textAlign: "right" }}>Add : CGST @ 9.00 %</td>
                  <td style={{ textAlign: "right" }}>{TaxData}</td>
                </tr>
                <tr>
                  <td> </td>
                  <td> </td>
                  <td></td>
                  <td style={{ textAlign: "center" }}></td>
                  <td style={{ textAlign: "right" }}>Add : SGST @ 9.00 % </td>
                  <td style={{ textAlign: "right" }}>{TaxData}</td>
                </tr>
                <tr></tr>
                <tr>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td ></td>
                  <td style={{ textAlign: "right" }}>
                    Total Rs.
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {TotalData}{" "}
                    <input
                      type="hidden"
                      id="amt"
                      name="amt"
                      defaultValue="11,446.00"
                    />
                  </td>
                </tr>
                <tr>

                  <td id="words_amt" colSpan={"5"} style={{ textAlign: "right" }}>
                    {TotalData}{" "}
                    <input
                      type="hidden"
                      id="amt"
                      name="amt"
                      defaultValue="11,446.00"
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>E &amp; OE</td>
                </tr>
                </tbody>
              </table>


            </div>

            {/*footer */}
            <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
            <div className="flex justify-between flex-wrap">
              <div className="gap-4 px-4 grid-cols-3"><div className="shrink-0">
                <img src={printData?.invoice?.qr} style={{ textAlign: "center", width: "25%" }} alt='image' />
              </div></div>
              <div className="text-right grid-cols-9">
                <img src="/assets/images/logo_3.jpg" alt="img" style={{ marginLeft: "auto" }} />
                <div className="space-y-1 mt-0 text-white-dark text-right text-sm">


                  <br />  <b>Phone</b> :  9840014193 <br></br>
                  <br /> <i><b>Email :</b> cbe@covaiciviltechlab.com </i> | <i><b>Website : </b>www.covaiciviltechlab.com</i>
                  <br></br>


                  <b style={{ textAlign: "right" }}>THIRUMALAI.</b>
                  <br />
                  TECHNICAL DIRECTOR


                </div>
              </div>
            </div>


          </div>
        </div>

        <div className='container text-sm'> <div style={{ textAlign: "center", paddingTop: "15px" }}>
          <b>Declaration:-</b> We declare that this invoice shows the actual price of the
          Test Services described and that all particulars are true and correct. <br /> <br />
        </div>
          <div style={{ textAlign: "center" }}>
            SUBJECT TO COIMBATORE JURISDICTION
            <br /> This is computer Generated Invoice.
          </div>

        </div>

      </div>

    </>

  );
};

export default Preview;
