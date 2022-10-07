import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import { Button } from "react-bootstrap";
import ReactPagination from "react-paginate";
import {
  getListVoucherSerialController,
  listVoucherStatusController,
} from "../controller/voucherSerialApis";

function ListVoucherSerial(props) {
  //======================================== CONFIG DATA ===============================================
  const [listVoucherSerial, setListVoucherSerial] = useState([]);
  const [listVoucherStatus, setListVoucherStatus] = useState([]);
  let [totalRecord, setTotalPage] = useState(0);
  const [request, setRequest] = useState({
    searchByName: "",
    voucherStatus: "",
    size: 20,
    index: 1,
  });

  let header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: props.token,
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 35,
    }),
  };

  //====================================================================================================

  //====================================== CALL API ===============================================
  // Trạng thái đợt phát hành
  const axiosListVoucherStatus = async () => {
    let result = [];
    let response = await listVoucherStatusController(header);
    if (response.data && response.status === 200) {
      // console.log(response.data);
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListVoucherStatus(result);
    }
  };
  //lấy ra ds đợt phát hành
  const axiosGetListVoucherSerial = async () => {
    let response = await getListVoucherSerialController(request, header);
    if (response.data && response.status === 200) {
      // console.log(response.data);
      setListVoucherSerial(response.data.listData);
      setTotalPage(response.data.totalRecord);
    }
  };
  //====================================================================================================

  //====================================== HANDLE DATA SEARCH ===============================================
  const handleSearchVoucherSerial = (data) => {
    setRequest({ ...request, searchByName: data.target.value });
  };
  const handleSearchVoucherSerialStatus = (data) => {
    setRequest({ ...request, voucherStatus: data.value });
  };
  const searchDataVoucherSerial = async () => {
    let response = await getListVoucherSerialController(request, header);
    if (response.data && response.status === 200) {
      // console.log(response.data);
      setListVoucherSerial(response.data.listData);
      setTotalPage(response.data.totalRecord);
    }
  };
  //====================================================================================================

  //====================================== HANDLE BUTTON ===============================================
  const openFormEdit = (data) => {
    // data.preventDefault();
    console.log(data);
  };

  const onPageClick = (data) => {
    // console.log(data);
    setRequest({ ...request, index: data.selected + 1 });
    window.scrollTo(0, 0);
  };
  const onRefresh = () => {
    window.location.reload();
  };
  //====================================================================================================

  //========================================== RENDER ==================================================
  useEffect(() => {
    axiosGetListVoucherSerial();
    axiosListVoucherStatus();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="card-content-title">
            Danh sách đợt phát hành E-Voucher
          </h3>
          <div className="row ">
            <div className="form-group col-md-3 pdr-menu">
              <input
                type="text"
                className="form-control"
                placeholder="Tên đợt phát hành"
                onChange={handleSearchVoucherSerial}
              />
            </div>

            <div className="form-group col-md-3 pdr-menu edit-card-select">
              <Select
                styles={customStyles}
                options={listVoucherStatus}
                placeholder="Trạng thái"
                onChange={handleSearchVoucherSerialStatus}
              />
            </div>

            <div className="form-group col-md-3 pdr-menu">
              <button
                type="button"
                className="btn btn-primary bth-cancel btn-icon-text"
                onClick={searchDataVoucherSerial}
              >
                Tìm kiếm
              </button>
            </div>

            <div className="form-group col-md-3 pdl-menu">
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
                  <th className="font-weight-bold" rowSpan="2" width="5%">
                    Loại
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Loại mã
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Từ ngày
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
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
