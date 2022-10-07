import axios from "../../../../axios";

const getListVoucherController=(data,headers) =>{
    return axios({
        url: "/api/filter-vouchers",
        method: "GET",
        params: {
            code : data.code,
            name : data.name,
            page : data.page,
            size : data.size,
            status : data.status,
        },
        headers: headers,
    });
};
const getListVoucherUsedController=(data,headers) =>{ 
    return axios({
        url: "/api/filter-vouchers-used",
        method: "post",
        data: data,
        headers: headers,
    });
};
const getExportListVoucherUsedController=(data,headers) =>{ 
    return axios({
        url: "/api/export-vouchers-used",
        method: "post",
        data: data,
        headers: headers,
        responseType: 'blob',

    });
};
const recallVoucherController=(data,headers) =>{
    return axios({
        url: "/api/recall-voucher",
        method: "post",
        data: data,
        headers: headers,
    });
};
//trang thai cua voucher
const listStatusVoucherController = (header) => {
    return axios({
      url: "/api/voucher-status",
      method: "get",
      headers: header,
    });
  };

export{
    getListVoucherController,
    getListVoucherUsedController,
    recallVoucherController,
    listStatusVoucherController,
    getExportListVoucherUsedController,
}