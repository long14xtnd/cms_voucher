import axios from "../../../../axios";
//create voucherSerial
const createVoucherSerialController = (header, data) => {
  return axios({
    url: "/addvoucherserial/add",
    method: "post",
    headers: header,
    data: data,
  });
};

// Danh sách user
const listUserController = (header) => {
  return axios({
    url: "/addvoucherserial/getalluser",
    method: "get",
    headers: header,
  });
};
// Loại (Voucher/E-coupon)
const listVoucherTypeController = (header) => {
  return axios({
    url: "/addvoucherserial/getvouchertype",
    method: "get",
    headers: header,
  });
};
// Dịch vụ áp dụng
const listServiceApplicationController = (header) => {
  return axios({
    url: "/addvoucherserial/getserviceapplication",
    method: "get",
    headers: header,
  });
};
// Hình thức
const listDiscountFormController = (header) => {
  return axios({
    url: "/addvoucherserial/getdiscountform",
    method: "get",
    headers: header,
  });
};
// Dựa trên
const listDiscountTypeController = (header) => {
  return axios({
    url: "/addvoucherserial/getdiscounttype",
    method: "get",
    headers: header,
  });
};
// Trạng thái đợt phát hành
const listVoucherStatusController = (header) => {
  return axios({
    url: "/addvoucherserial/getvoucherstatus",
    method: "get",
    headers: header,
  });
};
// Phương thức thanh toán
const listPaymentController = (header) => {
  return axios({
    url: "/addvoucherserial/getpayments",
    method: "get",
    headers: header,
  });
};
// Gói cước khuyến mại
const listPackageController = (header) => {
  return axios({
    url: "/addvoucherserial/getpackages",
    method: "get",
    headers: header,
  });
};
const listFromProvinceController = (data, header) => {
  return axios({
    url: "/addvoucherserial/getfromprovince/",
    method: "get",
    params: {
      packageId: data,
    },
    headers: header,
  });
};
//Phạm vi áp dụng mã theo khu vực giao
const listToProvinceController = (data, header) => {
  return axios({
    url: "/addvoucherserial/gettoprovince/",
    method: "get",
    params: {
      packageId: data,
    },
    headers: header,
  });
};
//Loại mã
const listCodeTypeController = (header) => {
  return axios({
    url: "/addvoucherserial/getcodetype",
    method: "get",
    headers: header,
  });
};
export {
  listVoucherTypeController,
  listServiceApplicationController,
  listDiscountFormController,
  listDiscountTypeController,
  listVoucherStatusController,
  listPaymentController,
  listPackageController,
  listFromProvinceController,
  listToProvinceController,
  listCodeTypeController,
  listUserController,
  createVoucherSerialController,
};
