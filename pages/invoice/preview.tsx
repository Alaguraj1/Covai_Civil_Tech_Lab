import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

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
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html:
            "\n.style3 {\n\tfont-size: 22px;\n\tfont-weight: bold;\n}\n\ntable td, th {\n\tfont-size: 13px;\n}\n"
        }}
      />
      <table width={800} border={0} cellSpacing={3} cellPadding={3}>
        <tbody>
          <tr style={{ height: 100 }}>
            <td colSpan={2}>
              <table width={800} border={1} cellSpacing={0} cellPadding={5}>
                <tbody>
                  <tr>
                    <td width="9%" align="left" valign="middle">
                      <img src="https://civiltechnolab.in/new_app/techno/images/logo_3.jpg" />
                    </td>
                    <td width="82%" align="center" valign="middle">
                      <span className="style3">
                       COVAI CIVIL TECH LAB PRIVATE LIMITED
                        <br /> AN ISO 9001:2008 CERTIFIED LAB
                      </span>
                      <br /> All Building Material Testing and Building Repair
                      Consultancy
                      <br />
                      GSTIN : {printData?.customer?.gstin_no}
                    </td>
                    <td width="5%">
                      <img
                        src="https://civiltechnolab.in/new_app/techno/images/logo_1.jpg"
                        alt="logo"
                      />
                    </td>
                    <td width="4%" align="right" valign="middle">
                      <img
                        src="https://civiltechnolab.in/new_app/techno/images/logo_2.jpg"
                        alt="logo2"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              <h2>INVOICE</h2>
            </td>
          </tr>
          <tr>
            <td>
              Date : {printData?.invoice?.date}
              <br />
              Bill No : {printData?.invoice?.invoice_no}
            </td>
            <td>
              <ul style={{ listStyleType: "circle" }}>
                <li>Original for Receipient</li>
                <li>Duplicate for Supplier Transporter</li>
                <li>Triplicate for Supplier</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              {printData?.customer?.address1}
              <br />
            </td>
            <td>
              Code : {printData?.customer?.code}
              <br />
              Place of Testing : {printData?.customer?.place_of_testing}
              <br />
              GSTIN/UIN : {printData?.customer?.gstin_no}
              <br />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <b style={{ textAlign: "left" }}>
                PROJECT : M/s KG (T &amp; C.Dev), Kadri Mills Precast Plant Site,
                Ondipdur{" "}
              </b>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className='table-1'>
                <table width={800} border={1} cellSpacing={0} cellPadding={5}>
                  <tbody>
                    <tr>
                      <th style={{ width: "50px" }}>S.No</th>
                      <th style={{ width: "50px" }}>Name of Test</th>
                      <th style={{ width: "50px" }}>Qty</th>
                      <th style={{ width: "100px" }}>Rate/Sample(INR)</th>
                      <th style={{ width: "100px" }}>Amount(INR)</th>
                    </tr>

                    {
                      printData?.invoice_tests?.map((invoice: any) => {
                        return (
                          <>
                            <tr>
                              <td>{invoice?.id}</td>
                              <td>{invoice?.test_name} - <span style={{ fontWeight: "bold" }}>{invoice?.material_name}</span></td>
                              <td>{invoice?.qty}</td>
                              <td>{invoice?.price_per_sample}</td>
                              <td>{invoice?.total}</td>
                            </tr>

                          </>
                        )
                      })

                    }
                    {/* <tr>
                      <td style={{ textAlign: "center" }}>1</td>
                      <td>
                        <i>Soil - Compaction Factor </i>-<b>Compaction</b>
                      </td>
                      <td style={{ textAlign: "center" }}>6</td>
                      <td style={{ textAlign: "right" }}>1,500.00 </td>
                      <td style={{ textAlign: "right" }}>9,000.00 </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }}>2</td>
                      <td>
                        <i>Transportation </i>-<b>Taxi </b>
                      </td>
                      <td style={{ textAlign: "center" }}>1</td>
                      <td style={{ textAlign: "right" }}>700.00 </td>
                      <td style={{ textAlign: "right" }}>700.00 </td>
                    </tr> */}
                    <tr>
                      <td colSpan={5} id="" style={{ textAlign: "center" }}>
                        GST 18%
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "center" }} />
                      <td>Add : CGST @ 9.00 % </td>
                      <td style={{ textAlign: "center" }}>-</td>
                      <td style={{ textAlign: "center" }}>-</td>
                      <td style={{ textAlign: "right" }}>{TaxData}</td>
                    </tr>
                    <tr>
                      {" "}
                      <td style={{ textAlign: "center" }} />
                      <td>Add : SGST @ 9.00 % </td>
                      <td style={{ textAlign: "center" }}>-</td>
                      <td style={{ textAlign: "center" }}>-</td>
                      <td style={{ textAlign: "right" }}>{TaxData}</td>
                    </tr>
                    <tr></tr>
                    <tr>
                      <td colSpan={2} id="" />
                      <td colSpan={2} style={{ textAlign: "right" }}>
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
                      <td colSpan={4} id="words_amt">
                        {TotalData}{" "}
                        <input
                          type="hidden"
                          id="amt"
                          name="amt"
                          defaultValue="11,446.00"
                        />
                      </td>
                      <td>E &amp; OE</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className='table-1'>
                <table width={800} border={1} cellSpacing={0} cellPadding={5}>
                  <tbody>
                    <tr>
                      <th rowSpan={2}>HAN/SAC</th>
                      <th rowSpan={2}>Taxable Value</th>
                      <th colSpan={2}>Central Tax</th>
                      <th colSpan={2}>State Tax</th>
                    </tr>
                    <tr>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                    <tr style={{ textAlign: "right" }}>
                      <th>998346</th>
                      <td>{totalAmount}</td>
                      <td>9.00%</td>
                      <td>{TaxData}</td>
                      <td>9.00%</td>
                      <td>{TaxData}</td>
                    </tr>
                    <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                      <th>Total</th>
                      <td>{totalAmount}</td>
                      <td />
                      <td>{TaxData}</td>
                      <td />
                      <td>{TaxData}</td>
                    </tr>
                    <tr>
                      <td colSpan={6} id="words_amt2">
                       {printData?.invoice?.inr}{" "}
                        <input
                          type="hidden"
                          id="amt"
                          name="amt"
                          defaultValue="11,446.00"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
      <table width={800} border={0} cellSpacing={3} cellPadding={3}>
        <tbody>
          <tr>
            <td width="55%">
              No.12/26, Thandhai Periyar Nagar 2nd St,Sowripalayam To
              Masakkalipalayam Road,
              <br /> Sowripalayam,Coimbatore-641048. Ph : 0422 - 2575903
              <br /> Mobile: 9842234561 / 9382574564 / 9626783884.
              <br /> <i>Email : civiltechnolab@gmail.com </i>
              <br /> <i>Website : www.civiltechnolab.in </i>
              <p>
                BANK DETAILS: Civiltechnolab P Ltd, <br />
                Ac/No: 62371331494, Branch: SBI, KALAPATTI, IFSC CODE: SBIN0021798.
              </p>
            </td>
            <td width="" style={{ textAlign: "center" }}>
              <img
                src={printData?.invoice?.qr}
                style={{ textAlign: "center", width: "50%" }}
              // alt='image'
              />
            </td>
            <td width="25%" style={{ textAlign: "right" }}>
              <b>
                <br />COVAI CIVIL TECH LAB Pvt Ltd
                <br />
                <br /> <br /> <br /> <br />{" "}
                <b style={{ textAlign: "right" }}>S.CHANDRASEKAR.,ME.,</b>
                <br />
                TECHNICAL DIRECTOR
              </b>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <div style={{ textAlign: "center" }}>
                <u>Declaration:-</u>
                <br /> We declare that this invoice shows the actual price of the
                Test Services described and that all particulars are true and
                correct. <br /> <br />
              </div>
              <div style={{ textAlign: "center" }}>
                SUBJECT TO COIMBATORE JURISDICTION
                <br /> This is computer Generated Invoice.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>

  );
};

export default Preview;
