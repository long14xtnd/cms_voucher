import axios from "../../../../axios";
//API Check role user
const getUserDetailController = (header) => {
  return axios({
    url: "/api/user-detail",
    method: "get",
    headers: header,
  });
};
//API Phát hành voucher
const requestRelaseVoucherSerial = (data, header) => {
  return axios({
    url: "/api/request-release",
    method: "POST",
    data: data,
    headers: header,
  });
};
//sửa đợt phát hành
const editVoucherSerialController = (data, header) => {
  return axios({
    url: "/edit-voucher-serial/edit",
    method: "POST",
    data: data,
    headers: header,
  });
};
//get chi tiết thông tin đợt phát hành
const getDetailVoucherSerialController = (id, header) => {
  return axios({
    url: "/detail-voucher-serial/detail",
    method: "GET",
    params: {
      voucherSerialId: id,
    },
    headers: header,
  });
};
//get danh sách đợt phát hành
const getListVoucherSerialController = (data, header) => {
  return axios({
    url: "/list-voucher-serial/list",
    method: "GET",
    params: {
      searchByName: data.searchByName,
      voucherStatus: data.voucherStatus,
      size: data.size,
      index: data.index,
      fromCreateDate: data.fromCreateDate,
      toCreateDate: data.toCreateDate,
    },
    headers: header,
  });
};
//upload image
const uploadImageController = (header, data) => {
  return axios({
    url: "https://haloship.imediatech.com.vn/imedia/auth/media/upload_file",
    method: "POST",
    headers: header,
    data: data,
  });
};
//create voucherSerial
const createVoucherSerialController = (header, data) => {
  return axios({
    url: "/add-voucher-serial/add",
    method: "POST",
    headers: header,
    data: data,
  });
};
//danh sách tỉnh quận huyện
const getAllProvinceController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-all-province",
    method: "get",
    headers: header,
  });
};
// Danh sách user
const listUserController = (data, header) => {
  if (!data) {
    return [];
  }
  return axios({
    url: "/add-voucher-serial/get-all-user",
    method: "get",
    params: {
      phone: data,
    },
    headers: header,
  });
};
// Loại (Voucher/E-coupon)
const listVoucherTypeController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-voucher-type",
    method: "get",
    headers: header,
  });
};
// Dịch vụ áp dụng
const listServiceApplicationController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-service-application",
    method: "get",
    headers: header,
  });
};
// Hình thức
const listDiscountFormController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-discount-form",
    method: "get",
    headers: header,
  });
};
// Dựa trên
const listDiscountTypeController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-discount-type",
    method: "get",
    headers: header,
  });
};
// Trạng thái đợt phát hành
const listVoucherStatusController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-voucher-status",
    method: "get",
    headers: header,
  });
};
// Phương thức thanh toán
const listPaymentController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-payments",
    method: "get",
    headers: header,
  });
};
// Gói cước khuyến mại
const listPackageController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-packages",
    method: "get",
    headers: header,
  });
};
//Phạm vi áp dụng mã theo khu vực gửi
const listFromProvinceController = (data, header) => {
  if (!data) {
    return [];
  }
  return axios({
    url: "/add-voucher-serial/get-from-province/",
    method: "get",
    params: {
      packageCode: data,
    },
    headers: header,
  });
};
//Phạm vi áp dụng mã theo khu vực giao
const listToProvinceController = (data, header) => {
  if (!data) {
    return [];
  }
  return axios({
    url: "/add-voucher-serial/get-to-province/",
    method: "get",
    params: {
      packageCode: data,
    },
    headers: header,
  });
};
//Loại mã
const listCodeTypeController = (header) => {
  return axios({
    url: "/add-voucher-serial/get-code-type",
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
  uploadImageController,
  getListVoucherSerialController,
  getDetailVoucherSerialController,
  editVoucherSerialController,
  requestRelaseVoucherSerial,
  getAllProvinceController,
  getUserDetailController,
};
