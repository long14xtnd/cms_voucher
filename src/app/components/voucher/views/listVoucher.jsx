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
import Checkbox from "../controller/Checkbox";
import { Store } from "react-notifications-component";
import {
    listStatusVoucherController,
    getListVoucherController,
    recallVoucherController,
} from "../controller/voucherApis";

function GetListVoucher(props) {
    const customStyles = {
        control: (base) => ({
            ...base,
            height: 30,
            minHeight: 35,
        }),
    };
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [list, setList] = useState([]);
    const [listStatusVoucher, setListStatusVoucher] = useState([]);
    const [listVouchers, setListVouchers] = useState([]);
    let [totalRecord, setTotalRecord] = useState(0);
    const [request, setRequest] = useState({
        code: "",
        name: "",
        page: 1,
        size: 20,
        status: "",
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let header = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: props.token,
    };
    const axiosListStatusVoucher = async () => {
        let result = [];
        console.log(5466);
        let response = await listStatusVoucherController(header);
        if (response.data && response.status === 200) {
            response.data.map(item => {
                result.push({ value: item.code, label: item.name });
            });
        }
        setListStatusVoucher(result);
    }
    const [requestRecall, setRequestRecall] = useState({
        reasonRecall: "",
        voucherIds: [],
    });

    const axiosRecallVoucherController = async () => {
        const requestRecallVoucher = {
            reasonRecall: "",
            voucherIds: [],
        }
        requestRecallVoucher.reasonRecall = document.getElementById('recallInput').value;
        requestRecallVoucher.voucherIds =isCheck;
        setRequestRecall({ reasonRecall: document.getElementById('recallInput').value, voucherIds: isCheck });
        setShow(false);
        console.log(requestRecallVoucher);

        let response = await recallVoucherController(requestRecallVoucher, header);
        console.log(11111111);
        if (response.status === 200) {
            callNotify("Success", response.message, 3000);
        } else {
            callNotify("Danger", response.message, 3000);
        }
        axiosListVoucher();
    }
    const axiosListVoucher = async () => {
        let result = [];
        let response = await getListVoucherController(request, header);
        if (response.data && response.status === 200) {
            setListVouchers(response.data.vouchers);
            setTotalRecord(response.data.totalRecord);
            response.data.vouchers.map((item => {
                result.push({ id: item.id.toString(), code: item.code })
            }))
        }
        setList(result);
    }
    //====================================== HANDLE DATA SEARCH ===============================================

    const handleSearchVoucherByCode = (data) => {
        setRequest({ ...request, code: data.target.value });
    }
    const handleSearchVoucherByName = (data) => {
        setRequest({ ...request, name: data.target.value });
    }
    const handleSearchVoucherByStatus = (data) => {
        setRequest({ ...request, status: data.value });
    }

    //====================================== HANDLE BUTTON ===============================================
    const onPageClick = (data) => {
        console.log(data);
        setRequest({ ...request, page: data.selected + 1 });
        console.log(request)
        window.scrollTo(0, 0);
        axiosListVoucher();

    };

    const onRefresh = () => {
        window.location.reload();
    };
    const recallVoucher = () => {
        console.log(document.getElementById('recallInput').value);
        console.log(isCheck);

        // const tempt = {
        //     reasonRecall: "",
        //     voucherIds: [],
        // }
        // tempt.reasonRecall = document.getElementById('recallInput').value;
        // tempt.voucherIds = isCheck;
        // setRequestRecall(tempt);
        setRequestRecall({ reasonRecall: document.getElementById('recallInput').value, voucherIds: isCheck });
        setShow(false);
        axiosRecallVoucherController();
    }
    const callNotify = (type, message, time) => {
        Store.addNotification({
            title: "Thông báo",
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: time,
                onScreen: true,
            },
        });
    };
    const filterList = () => {
        axiosListStatusVoucher();
        axiosListVoucher();
    }
    //========================================== RENDER ==================================================
    useEffect(() => {
        axiosListStatusVoucher();
        axiosListVoucher();
    }, []);
    useEffect(() => {
        console.log(requestRecall);
    }, [requestRecall]);
    const getStatusById = (id) => {
        for (let ss of listStatusVoucher) {
            let statusCode = ss.value + "";
            if (statusCode == id) {
                return ss.label;
            }
        }
    }

    useEffect(() => {
        setList(listVouchers);
    }, [list]);
    //========================================== Multi checkbox ==================================================

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map((li) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, parseInt(id)]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => parseInt(item) !== parseInt(id)));
        }
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thu hồi voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Lý do thu hồi"
                        id="recallInput"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={axiosRecallVoucherController}>Thu hồi voucher</Button>
                </Modal.Footer>
            </Modal>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-content-title">
                        Danh sách Voucher
                    </h3>
                    <div className="row ">
                        <div className="form-group col-md-3 pdr-menu">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Mã Voucher"
                                onChange={handleSearchVoucherByCode}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên đợt phát hành"
                                onChange={handleSearchVoucherByName}
                            />
                        </div>
                        <div className="form-group col-md-3 pdr-menu edit-card-select">
                            <Select
                                styles={customStyles}
                                options={listStatusVoucher}
                                placeholder="Trạng thái"
                                onChange={handleSearchVoucherByStatus}
                            />
                        </div>

                        <div className="form-group col-md-3 pdl-menu">
                            <div className="d-flex align-items-center justify-content-md-end">
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <Button
                                        className="btn btn-success bth-cancel btn-icon-text"
                                        onClick={filterList}
                                    >
                                        Tìm Kiếm
                                    </Button>
                                </div>
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <Button
                                        className="btn btn-success bth-cancel btn-icon-text"
                                        onClick={onRefresh}
                                    >
                                        Bỏ lọc
                                    </Button>
                                </div>
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <Button
                                        className="btn btn-danger bth-cancel btn-icon-text"
                                        onClick={handleShow}
                                    >
                                        Thu hồi
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-custom">
                            <thead>
                                <tr>
                                    <th className="font-weight-bold" rowSpan="2" width="3%">
                                        <Checkbox
                                            type="checkbox"
                                            name="selectAll"
                                            id="selectAll"
                                            handleClick={handleSelectAll}
                                            isChecked={isCheckAll}
                                        />
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="10%">
                                        Mã voucher
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="10%">
                                        Tên đợt PH
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="15%">
                                        Ngày phát hành
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="15%">
                                        Ngày hết hạn
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="10%">
                                        Ngày sử dụng
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="10%">
                                        SL khả dụng
                                    </th>
                                    <th className="font-weight-bold" rowSpan="2" width="15%">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listVouchers && listVouchers.length !== 0 ? (
                                    listVouchers.map((item, i) => (
                                        <tr key={i}>
                                            <td >
                                                <Checkbox
                                                    key={parseInt(item.id)}
                                                    type="checkbox"
                                                    name={parseInt(item.id)}
                                                    id={parseInt(item.id)}
                                                    handleClick={handleClick}
                                                    isChecked={isCheck.includes(parseInt(item.id))}
                                                />
                                            </td>
                                            <td >{item.code}</td>
                                            <td >{item.nameVoucher}</td>
                                            <td >{item.issuedDate}</td>
                                            <td >{item.expirationDate}</td>
                                            <td >{item.usedDate}</td>
                                            <td >{item.availableUsage}</td>
                                            <td >{getStatusById(item.status)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colspan="9" className="text-center">
                                            Không có voucher nào
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

export default connect(mapStateToProps, mapDispatchToProps)(GetListVoucher);
