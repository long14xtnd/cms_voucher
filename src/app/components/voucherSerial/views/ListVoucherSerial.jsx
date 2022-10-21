import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import { Button } from "react-bootstrap";
import ReactPagination from "react-paginate";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import {
  getListVoucherSerialController,
  listVoucherStatusController,
  getUserDetailController,
} from "../controller/voucherSerialApis";

function ListVoucherSerial(props) {
  //========================================== GET ROLE =================================================
  let header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: props.token,
  };
  const [role, setRole] = useState("");
  // api get role
  const axiosGetRoleUser = async () => {
    let response = await getUserDetailController(header);
    setRole(response.role);
  };
  //======================================== CONFIG DATA ===============================================
  const [listVoucherSerial, setListVoucherSerial] = useState([]);
  const [listVoucherStatus, setListVoucherStatus] = useState([]);
  const [fromCreateDate, setFromCreateDate] = useState();
  const [toCreateDate, setToCreateDate] = useState();
  let [totalRecord, setTotalPage] = useState(0);
  const [request, setRequest] = useState({
    searchByName: "",
    voucherStatus: "",
    size: 20,
    index: 1,
    fromCreateDate: "",
    toCreateDate: "",
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 35,
    }),
  };
  //định dạng ngày/tháng/năm
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  //====================================================================================================

  //====================================== CALL API ===============================================
  // api ds trạng thái đợt phát hành
  const axiosListVoucherStatus = async () => {
    let result = [];
    let response = await listVoucherStatusController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListVoucherStatus(result);
    }
  };
  //api lấy ra ds đợt phát hành
  const axiosGetListVoucherSerial = async () => {
    let response = await getListVoucherSerialController(request, header);
    if (response.data && response.status === 200) {
      setListVoucherSerial(response.data.listData);
      setTotalPage(response.data.totalRecord);
    }
  };
  //====================================================================================================

  //====================================== HANDLE DATA SEARCH ===============================================
  //onchange nhập tên đợt phát hành
  const handleSearchVoucherSerial = (data) => {
    setRequest({ ...request, searchByName: data.target.value });
  };
  //onchange select trạng thái đợt phát hành
  const handleSearchVoucherSerialStatus = (data) => {
    setRequest({ ...request, voucherStatus: data.value });
  };
  //api get danh sách đợt phát hành
  const searchDataVoucherSerial = async () => {
    let response = await getListVoucherSerialController(request, header);
    if (response.data && response.status === 200) {
      setListVoucherSerial(response.data.listData);
      setTotalPage(response.data.totalRecord);
    }
  };
  //onchange select ngày bắt đầu
  const handleChangeStartDate = (date) => {
    setFromCreateDate(date);
    setRequest({ ...request, fromCreateDate: formatDate(date) });
  };
  //onchange ngày kết thúc
  const handleChangeEndDate = (date) => {
    setToCreateDate(date);
    setRequest({ ...request, toCreateDate: formatDate(date) });
  };
  //====================================================================================================

  //====================================== HANDLE BUTTON ===============================================

  const onPageClick = (data) => {
    setRequest({ ...request, index: data.selected + 1 });
    window.scrollTo(0, 0);
  };
  //bỏ lọc
  const onRefresh = () => {
    window.location.reload();
  };
  //nhấn enter tìm kiếm đợt phát hành
  const handleKeyDownSearchVoucherSerial = (event) => {
    if (event.key === "Enter") {
      setRequest({ ...request, voucherSerialName: event.target.value });
    }
  };
  //====================================================================================================

  //========================================== RENDER ==================================================
  useEffect(() => {
    axiosGetRoleUser();
    axiosGetListVoucherSerial();
    axiosListVoucherStatus();
  }, []);
  useEffect(() => {
    axiosGetListVoucherSerial();
  }, [request.index]);
  useEffect(() => {
    axiosGetListVoucherSerial();
  }, [request.voucherSerialName]);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">ROLE-{role}</h4>
          <h3 className="card-content-title">
            Danh sách đợt phát hành E-Voucher
          </h3>
          <div className="row mt-3">
            <div className="form-group col-md-2 pdr-menu">
              <input
                type="text"
                className="form-control"
                placeholder="Tên đợt phát hành"
                onChange={handleSearchVoucherSerial}
                onKeyDown={handleKeyDownSearchVoucherSerial}
              />
            </div>

            <div className="form-group col-md-2 pdr-menu edit-card-select">
              <Select
                styles={customStyles}
                options={listVoucherStatus}
                placeholder="Trạng thái"
                onChange={handleSearchVoucherSerialStatus}
              />
            </div>
            <div className="col-md-2">
              <Form.Group className="row">
                <label className=" col-form-label">Từ ngày</label>
                <div className="col-sm-9">
                  <DatePicker
                    className="form-control w-100"
                    selected={fromCreateDate}
                    onChange={handleChangeStartDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Form.Group className="row">
                <label className=" col-form-label">Đến ngày</label>
                <div className="col-sm-9">
                  <DatePicker
                    className="form-control w-100"
                    selected={toCreateDate}
                    onChange={handleChangeEndDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </Form.Group>
            </div>

            <div className="form-group col-md-2 pdr-menu">
              <button
                type="button"
                className="btn btn-primary bth-cancel btn-icon-text"
                onClick={searchDataVoucherSerial}
              >
                Tìm kiếm
              </button>
            </div>

            <div className="form-group col-md-2 pdl-menu">
              <div className="d-flex align-items-center justify-content-md-end">
                <div className="pr-1 mb-3 mb-xl-0">
                  <button
                    type="button"
                    className="btn btn-danger bth-cancel btn-icon-text"
                    onClick={onRefresh}
                  >
                    Bỏ lọc
                  </button>
                </div>
                <div className="pr-1 mb-3 mb-xl-0">
                  <Link
                    className="btn btn-success bth-cancel btn-icon-text"
                    to="/createVoucherSerial"
                  >
                    Thêm mới
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-custom">
              <thead>
                <tr>
                  <th className="font-weight-bold" rowSpan="2" width="10%">
                    Action
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="20%">
                    Tên đợt
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="10%">
                    Loại
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Loại mã
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="10%">
                    Ngày tạo
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="10%">
                    Từ ngày
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="10%">
                    Đến ngày
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="5%">
                    Mệnh giá
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="5%">
                    Số lượng
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="3%">
                    Sử dụng
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="20%">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {listVoucherSerial && listVoucherSerial.length !== 0 ? (
                  listVoucherSerial.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <Link to={`/createVoucherSerial?copyFromId=${item.id}`}>
                          <Button className="btn btn-info btn-icon-custom">
                            {" "}
                            <i className="mdi mdi-checkbox-multiple-blank-outline"></i>
                          </Button>
                        </Link>
                        <Link to={`/createVoucherSerial?id=${item.id}`}>
                          <Button className="btn btn-primary btn-icon-custom">
                            {" "}
                            <i className="mdi mdi-pen"></i>
                          </Button>
                        </Link>
                      </td>
                      <td>
                        <Link to={`/createVoucherSerial?id=${item.id}`}>
                          {item.voucherSerialName}
                        </Link>
                      </td>
                      <td>{item.voucherType}</td>
                      <td>{item.codeType}</td>
                      <td>{item.createDate}</td>
                      <td>{item.fromDate}</td>
                      <td>{item.toDate}</td>
                      <td>{item.voucherValue}</td>
                      <td>{item.usageLimit}</td>
                      <td>{item.numberUsed}</td>
                      <td>{item.voucherStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center">
                      Không có Đợt phát hành voucher nào
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

export default connect(mapStateToProps, mapDispatchToProps)(ListVoucherSerial);
