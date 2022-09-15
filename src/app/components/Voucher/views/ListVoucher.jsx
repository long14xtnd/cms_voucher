import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Link, withRouter } from "react-router-dom";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import { Button } from "react-bootstrap";
function ListVoucher(props) {
  //======================================== CONFIG DATA ===============================================

  let header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: props.token,
  };

  const serviceTypeValues = [
    { value: "1", label: "Hoạt động" },
    { value: "2", label: "Không hoạt động" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 35,
    }),
  };

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
              />
            </div>

            <div className="form-group col-md-3 pdr-menu edit-card-select">
              <Select
                styles={customStyles}
                options={serviceTypeValues}
                placeholder="Trạng thái"
              />
            </div>

            <div className="form-group col-md-3 pdr-menu">
              <button
                type="button"
                className="btn btn-primary bth-cancel btn-icon-text"
              >
                Tìm kiếm
              </button>
            </div>

            <div className="form-group col-md-3 pdl-menu">
              <div className="d-flex align-items-center justify-content-md-end">
                <div className="pr-1 mb-3 mb-xl-0">
                  <Link
                    className="btn btn-success bth-cancel btn-icon-text"
                    to="/createVoucher"
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
                    Tên đợt
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
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
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Mệnh giá
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Số lượng
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Sử dụng
                  </th>
                  <th className="font-weight-bold" rowSpan="2" width="15%">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                <td>
                  <Button
                   
                    className="btn btn-primary btn-icon-custom"
                  >
                    <i className="mdi mdi-pen"></i>
                  </Button>
                </td>
                <td>Voucher</td>
                <td>Mã chung</td>
                <td>2/9/2022</td>
                <td>31/12/2022</td>
                <td>20,000</td>
                <td>100</td>
                <td>0</td>
                <td>Chờ duyệt</td>
              </tbody>
            </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListVoucher);
