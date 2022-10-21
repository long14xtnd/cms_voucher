import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Form, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../style/main.css";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import { Link, withRouter } from "react-router-dom";
import ReactPagination from "react-paginate";
import Select from "react-select";
import { Blob } from 'react-blob'
import {
    listStatusVoucherController,
    getListVoucherUsedController,
    getExportListVoucherUsedController,
} from "../controller/voucherApis";
import {
    listServiceApplicationController,
} from "../../voucherSerial/controller/voucherSerialApis";

function GetListVoucherUsed(props) {

    const [listStatusVoucher, setListStatusVoucher] = useState([]);
    const [listVouchersUsed, setListVouchersUsed] = useState([]);
    const [listServiceApplication, setListServiceApplication] = useState([]);
    let [totalRecord, setTotalRecord] = useState(0);
    let [totalOrder, setTotalOrder] = useState(0);
    let [totalRealityValue, setTotalRealityValue] = useState(0);

    const [request, setRequest] = useState({
        "keySearch": "",
        "page": 1,
        "serviceType": null,
        "size": 20,
        "statusUsed": null,
        "timeUsedFrom": "",
        "timeUsedTo": "",
        "voucherSerialName": ""
    });

    const customStyles = {
        control: (base) => ({
            ...base,
            height: 30,
            minHeight: 35,
        }),
    };
    let header = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: props.token,
    };
    const axiosListStatusVoucher = async () => {
        let result = [];
        let response = await listStatusVoucherController(header);
        if (response.data && response.status === 200) {
            response.data.map(item => {
                result.push({ value: item.code, label: item.name });
            });
        }
        setListStatusVoucher(result);
    }
    const axiosListServiceApplicationController = async () => {
        let result = [];
        let response = await listServiceApplicationController(header);
        if (response.data && response.status === 200) {
            response.data.map(item => {
                result.push({ value: item.name, label: item.name });
            });
        }
        setListServiceApplication(result);
    }
    const axiosListVoucherUsed = async () => {
        let response = await getListVoucherUsedController(request, header);
        if (response.data && response.status === 200) {
            setListVouchersUsed(response.data.vouchers);
            setTotalRecord(response.data.totalRecord);
            setTotalRealityValue(response.data.totalRealityValue);
            setTotalOrder(response.data.totalRecord);
        }
    }
    const axiosExportListVoucherUsedController = async () => {
        let response = await getExportListVoucherUsedController(request, header);
        console.log(response);
        const href = URL.createObjectURL(response);
        // create "a" HTLM element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.xlsx'); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        // response.blob();
    }
    const handleSearchVoucherByCode = (data) => {
        setRequest({ ...request, keySearch: data.target.value });
    }
    const handleSearchVoucherByName = (data) => {
        setRequest({ ...request, voucherSerialName: data.target.value });
    }
    const handleSearchVoucherByService = (data) => {
        setRequest({ ...request, serviceType: data.value.toUpperCase() });
    }
    const handleSearchVoucherByStatus = (data) => {
        setRequest({ ...request, statusUsed: data.value });
    }
    const handleSearchVoucherByTimeFrom = (data) => {
        setRequest({ ...request, timeUsedFrom: data.target.value });
    }
    const handleSearchVoucherByTimeTo = (data) => {
        setRequest({ ...request, timeUsedTo: data.target.value });
    }


    const onPageClick = (data) => {
        console.log(data);
        setRequest({ ...request, page: data.selected + 1 });
        console.log(request)
        window.scrollTo(0, 0);
    };

    const onRefresh = () => {
        window.location.reload();
    };
    const filterList = () => {
        axiosListVoucherUsed();
    };
    const exportExcel = () => {
        axiosExportListVoucherUsedController();
    }
    useEffect(() => {
        axiosListVoucherUsed();
        axiosListStatusVoucher();
        axiosListServiceApplicationController();
    }, []);
    useEffect(() => {
        console.log(request);
    }, [request]);
    useEffect(() => {
        axiosListVoucherUsed();
    }, [request.page]);
    const getStatusById = (id) => {
        for (let ss of listStatusVoucher) {
            let statusCode = ss.value + "";
            if (statusCode == id) {
                return ss.label;
            }
        }
    }
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-content-title">
                        Danh sách Voucher
                    </h3>
                    <div className="row ">
                        <div className="form-group col-md-3 pdr-menu">
                            <label className="label-control">Nhập tìm kiếm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Mã Voucher, mã đơn hàng"
                                onChange={handleSearchVoucherByCode}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu">
                            <label className="label-control">Đợt phát hành</label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên đợt phát hành"
                                onChange={handleSearchVoucherByName}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu edit-card-select">
                            <label className="label-control">Loại giao dịch</label>

                            <Select
                                styles={customStyles}
                                options={listServiceApplication}
                                placeholder="Loại giao dịch"
                                onChange={handleSearchVoucherByService}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu edit-card-select">
                            <label className="label-control">Trạng thái sử dụng</label>

                            <Select
                                styles={customStyles}
                                options={listStatusVoucher}
                                placeholder="Trạng thái"
                                onChange={handleSearchVoucherByStatus}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu">
                            <label className="label-control">Thời gian sử dụng từ</label>
                            <input
                                type="date"
                                className="form-control"
                                // placeholder=""
                                onChange={handleSearchVoucherByTimeFrom}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu">
                            <label className="label-control">Thời gian sử dụng tới</label>
                            <input
                                type="date"
                                className="form-control"
                                // placeholder=""
                                onChange={handleSearchVoucherByTimeTo}
                            />
                        </div>
                        <div className="form-group col-md-6 pdl-menu">
                            <div className="d-flex align-items-center justify-content-center p-3">
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <Link
                                        className="btn btn-primary bth-cancel btn-icon-text"
                                        onClick={onRefresh}
                                    >
                                        Bỏ lọc
                                    </Link>
                                </div>
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <button
                                        type="button"
                                        className="btn btn-success bth-cancel btn-icon-text"
                                        onClick={filterList}
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <Link
                                        className="btn btn-info bth-cancel btn-icon-text"
                                        onClick={exportExcel}
                                    >
                                        Xuất excel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-6 pdl-menu">
                        </div>
                        <div className=" col-md-6 pdl-menu">
                            <div className="row">
                                <div className=" col-md-4 ">
                                    <p><b>Tổng số đơn: </b> {totalOrder} </p>

                                </div>
                                <div className=" col-md-6 ">
                                    <p><b>Tổng tiền voucher hoàn khách: </b> {totalRealityValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} đ</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-custom">
                            <thead>
                                <tr>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Mã voucher
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Mã đơn hàng
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Tên đợt PH
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Tài khoản
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Loại giao dịch
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Giá trị giảm giá ban đầu
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Giá trị giảm thực tế
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Ngày phát hành
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Ngày Sử dụng
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="9%">
                                        Ngày cộng tiền ví
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="10%">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listVouchersUsed && listVouchersUsed.length !== 0 ? (
                                    listVouchersUsed.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.idVoucher}</td>
                                            <td>{item.orderCode}</td>
                                            <td>{item.voucherName}</td>
                                            <td>{item.userUsed}</td>
                                            <td>{item.serviceType}</td>
                                            <td>{item.expectValue}</td>
                                            <td>{item.realityValue}</td>
                                            <td>{item.issuedDate}</td>
                                            <td>{item.usedDate}</td>
                                            <td>{item.timeWalletRefund}</td>
                                            <td >{getStatusById(item.status)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colspan="9" className="text-center">
                                            Không có voucher nào đã sử dụng
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <ReactPagination
                            className=""
                            previousLabel={"<<"}
                            nextLabel={">>"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(totalRecord / request.size)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={4}
                            containerClassName={"pagination justify-content-center mt-4"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                            onPageChange={onPageClick}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
const mapStateToProps = (state) => {
    return {
        token: state.authReducer.detail.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveCustomerInfo: (data) => dispatch(saveCustomerInfo(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GetListVoucherUsed);

